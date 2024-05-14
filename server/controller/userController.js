const secretKey = "vik&rajan1";
const pool = require("../utils/db");
const bcrypt = require("bcrypt");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const jwt = require("jsonwebtoken");

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketregion = process.env.AWS_REGION;
const accesskey = process.env.AWS_ACCESS_KEY;
const secretkey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  Credentials: {
    accesskeyid: accesskey,
    secretKey: secretkey,
  },
  region: bucketregion,
});

exports.verifyGoogleToken = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await pool.query("SELECT * from users WHERE email=$1", [email]);

    if (user.rows.length === 0) {
      user = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password]
      );
    }

    const id = user.rows[0].id;
    const token = jwt.sign({ userId: id }, secretKey, {
      expiresIn: "1h",
    });

    return res.send({ status: true, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", status: false });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * from users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.send({ status: false, message: "User not found" });
    }

    const hashedPassword = user.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordMatch) {
      const id = user.rows[0].id;
      const token = jwt.sign({ userId: id }, secretKey, {
        expiresIn: "1h",
      });

      return res.send({ status: true, token: token });
    } else {
      return res.send({ status: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", status: false });
  }
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users(username,email,password)VALUES($1,$2,$3)",
      [username, email, hashedPassword]
    );

    res.send({ status: true });
    console.log(req.body);
    console.log(req.file);
    const params = {
      Bucket: bucketName,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.send({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", status: false });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token required." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log(decoded.userId);
    req.userId = decoded.userId;
    next();
  });
};

exports.getProfile = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.userId,
    ]);
    const user = response.rows[0];
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
