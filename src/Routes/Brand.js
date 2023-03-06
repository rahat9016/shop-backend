const express = require("express");
const upload = require("../Common/multer");
const { adminMiddleware, requireSigning } = require("../Common/userMiddleware");
const {
  brandCreate,
  getAllBrand,
  deleteBrand,
} = require("../Controller/Admin/Brand");
const router = express.Router();
router.post(
  "/brand/create",
  requireSigning,
  adminMiddleware,
  upload.single("brandLogo"),
  brandCreate
);
router.get("/get-brand", getAllBrand);
router.delete("/brand/:id", requireSigning, adminMiddleware, deleteBrand);

module.exports = router;
