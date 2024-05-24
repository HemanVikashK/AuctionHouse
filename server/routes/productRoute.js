const express = require("express");
const router = express.Router();
const {
  createProd,
  delProd,
  editProd,
  getAllProd,
  getProd,
  getAllProdUnSold,
  getAllProdSold,
  getAuctionResult,
} = require("../controller/productController");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", upload.single("image"), createProd);
router.put("/edit", editProd);
router.delete("/delete/:id", delProd);
router.get("/allproductsunsold", getAllProdUnSold);
router.get("/allproductssold", getAllProdSold);
router.get("/auctionresult/:id", getAuctionResult);

router.post("/prod", getProd);

module.exports = router;
