const express = require("express");
const upload = require("../Common/multer");
const {
  requireSigning,
  adminMiddleware,
  userMiddleware,
} = require("../Common/userMiddleware");

const {
  addProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  productCount,
  filterProducts,
  productStart,
  searchProducts,
} = require("../Controller/Admin/Product");

const router = express.Router();
router.post(
  "/admin/product/create",
  requireSigning,
  adminMiddleware,
  upload.array("productPictures"),
  addProduct
);

router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);

router.get("/products/total", productCount);
router.post("/search/products", searchProducts);

router.delete(
  "/product/delete/:id",
  requireSigning,
  adminMiddleware,
  deleteProduct
);
router.put(
  "/admin/product/update/:id",
  requireSigning,
  adminMiddleware,
  updateProduct
);
router.put(
  "/product/start/:productId",
  requireSigning,
  userMiddleware,
  productStart
);
module.exports = router;
