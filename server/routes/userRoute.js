
const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  verifyToken,
  getProfile,
  verifyGoogleToken,
} = require("../controller/userController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/login", login);
router.post("/signup",upload.single("image"), signup);
router.get("/profile", verifyToken, getProfile);
router.post("/gprofile", verifyGoogleToken);

module.exports = router;
