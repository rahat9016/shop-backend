const express = require("express");
const router = express.Router();
const upload = require("../Common/multer");
const { requireSigning, adminMiddleware } = require("../Common/userMiddleware");
const {
  addCategory,
  updateCategory,
  getCategory,
  deleteCategory,
} = require("../Controller/Admin/Category");

router.post(
  "/category",
  requireSigning,
  adminMiddleware,
  upload.single("categoryImg"),
  addCategory
);
router.post(
  "/category/:id",
  requireSigning,
  adminMiddleware,
  upload.single("categoryImgFile"),
  updateCategory
);
router.get("/category", getCategory);
router.delete("/category/:id", requireSigning, adminMiddleware, deleteCategory);

module.exports = router;
