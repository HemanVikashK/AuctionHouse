const pool = require("../utils/db"); // Replace with actual path to db.js
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketregion = process.env.AWS_REGION;
const accesskey = process.env.AWS_ACCESS_KEY;
const secretkey = process.env.AWS_SECRET_ACCESS_KEY;

const crypto = require("crypto");
const sharp = require("sharp");
const s3 = new S3Client({
  Credentials: {
    accesskeyid: accesskey,
    secretKey: secretkey,
  },
  region: bucketregion,
});
const randomImgName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

exports.createProd = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const buffer = await sharp(req.file.buffer)
      .resize({ height: 1080, width: 1080, fit: "contain" })
      .toBuffer();
    const imgId = randomImgName();
    const params = {
      Bucket: bucketName,
      Key: imgId,
      Body: buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);
    const {
      name,
      description,
      starting_price,
      userid,
      auction_start_time,
      main_category,
      sub_category,
    } = req.body;

    const newProduct = await pool.query(
      "INSERT INTO products (name, description, starting_price, user_id, image_url, created_at, auction_start_time,main_category,sub_category) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6,$7,$8) RETURNING *",
      [
        name,
        description,
        starting_price,
        userid,
        imgId,
        auction_start_time,
        main_category,
        sub_category,
      ]
    );

    res.status(201).json({
      status: true,
      data: newProduct.rows[0],
      message: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating product", status: false });
  }
};

exports.editProd = async (req, res) => {
  try {
    const { id, name, description, starting_price } = req.body;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (!product.rows[0]) {
      return res
        .status(404)
        .json({ error: "Product not found", status: false });
    }

    const updatedProduct = await pool.query(
      "UPDATE products SET name = $2, description = $3, starting_price = $4 WHERE id = $1 RETURNING *",
      [id, name, description, starting_price]
    );

    res.status(200).json({
      status: true,
      data: updatedProduct.rows[0],
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating product", status: false });
  }
};

exports.delProd = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (!product.rows[0]) {
      return res
        .status(404)
        .json({ error: "Product not found", status: false });
    }

    const getObjectParams = {
      Bucket: bucketName,
      Key: product.rows[0].image_url,
    };

    const command = new DeleteObjectCommand(getObjectParams);

    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    await s3.send(command);
    res
      .status(200)
      .json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting product", status: false });
  }
};
exports.getProd = async (req, res) => {
  try {
    const { id } = req.body; // Assuming product ID comes from URL params

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (!product.rows[0]) {
      return res
        .status(404)
        .json({ error: "Product not found", status: false });
    }

    const getObjectParams = {
      Bucket: bucketName,
      Key: product.rows[0].image_url,
    };

    const command = new GetObjectCommand(getObjectParams);

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    product.rows[0].image_url = url;
    res.status(200).json({ status: true, data: product.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting product", status: false });
  }
};

exports.getAllProdUnSold = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT * FROM products WHERE status ='unsold'"
    );

    for (const prod of products.rows) {
      if (prod.image_url) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: prod.image_url,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        prod.image_url = url;
      }
    }

    res.status(200).json({ status: true, data: products.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting products", status: false });
  }
};

exports.getAllProdSold = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT * FROM products WHERE status ='sold'"
    );

    for (const prod of products.rows) {
      if (prod.image_url) {
        const getObjectParams = {
          Bucket: bucketName,
          Key: prod.image_url,
        };

        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        prod.image_url = url;
      }
    }

    res.status(200).json({ status: true, data: products.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting products", status: false });
  }
};

exports.getAuctionResult = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const products = await pool.query(
      "SELECT * FROM auction_results where product_id=$1",
      [id]
    );
    console.log(products);
    res.status(200).json({ status: true, data: products.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting products", status: false });
  }
};
