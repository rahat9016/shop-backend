const express = require("express");
const {
  products,
  searchProductsByText,
  handleBestProduct,
  relatedProduct,
  filterProducts,
} = require("../Controller/initiateData");
const router = express.Router();

// get all products
router.get("/products", products);
// get related product with product id
router.get("/product/related/:productId", relatedProduct);
//get products by sold
router.post("/bestSelling", handleBestProduct);
// get product by search query
router.post("/search", searchProductsByText);
// get products multiple filed [category id, color, price range, brand, shipping]
router.post("/filter/products", filterProducts);

module.exports = router;
