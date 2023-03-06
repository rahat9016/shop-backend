const Product = require("../Models/Product");

// const handlePrice = async (req, res, price, categoryId) => {
//   try {
//     await Product.find({
//       $and: [
//         { categoryId: categoryId },
//         {
//           price: {
//             $gte: price[0],
//             $lte: price[1],
//           },
//         },
//       ],
//     })
//       .populate("categoryId")
//       .populate("brand")
//       .exec((error, products) => {
//         if (error) return res.status(400).json({ error });
//         if (products) return res.status(200).json({ products });
//       });
//   } catch (error) {}
// };

// const handleStar = async (req, res, stars) => {
//   Product.aggregate([
//     {
//       $project: {
//         document: "$$ROOT",
//         floorAverage: {
//           $floor: { $avg: "$reviews.star" },
//         },
//       },
//     },
//     {
//       $match: { floorAverage: stars },
//     },
//   ])
//     .limit(12)
//     .exec((error, aggregate) => {
//       Product.find({ _id: aggregate })
//         .populate("categoryId")
//         .populate("brand")
//         .exec((error, aggregate) => {
//           res.json({ products });
//         });
//     });
// };
// const handleShipping = async (req, res, shipping) => {
//   await Product.find({ shipping })
//     .populate("categoryId")
//     .populate("brand")
//     .limit(12)
//     .exec((error, products) => {
//       res.json({ products });
//     });
// };
// const handleColor = async (req, res, color) => {
//   await Product.find({ color })
//     .populate("categoryId")
//     .populate("brand")
//     .limit(12)
//     .exec((error, products) => {
//       res.json({ products });
//     });
// };
// const handleBrand = async (req, res, brandId) => {
//   await Product.find({ brand: brandId })
//     .populate("categoryId")
//     .populate("brand")
//     .limit(12)
//     .exec((error, products) => {
//       res.json({ products });
//     });
// };
// const handleBestProduct = async (req, res, sort, order, limit) => {
//   try {
//     await Product.find({})
//       .populate("categoryId")
//       .populate("brand")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec((error, products) => {
//         res.json({ products });
//       });
//   } catch (error) {}
// };
// exports.bestSelling = async (req, res) => {
//   const {
//     sort,
//     order,
//     limit,
//     price,
//     byCategoryId,
//     stars,
//     shipping,
//     color,
//     brand,
//   } = req.body;
//   if (sort && order && limit) {
//     await handleBestProduct(req, res, sort, order, limit);
//   } else if (price !== undefined) {
//     await handlePrice(req, res, price, byCategoryId);
//   } else if (stars) {
//     await handleStar(req.res, stars);
//   } else if (shipping) {
//     await handleShipping(req, res, shipping);
//   } else if (color) {
//     await handleColor(req, res, color);
//   } else if (brand) {
//     await handleBrand(req, res, brand);
//   }
// };

exports.products = async (req, res) => {
  const products = await Product.find({})
    .populate("categoryId")
    .populate("brand")
    .exec();
  res.json({ products });
};

const categoryProducts = async (req, res, id) => {
  try {
    const products = await Product.find({
      categoryId: id,
    }).exec();
    if (products) {
      res.status(200).json({ products: products });
    }
  } catch (error) {
    if (error) return res.status(400).json({ error: error });
  }
};

exports.filterProducts = async (req, res) => {
  const { id } = req.body;
  if (id) {
    await categoryProducts(req, res, id);
  }
};

// search products by text
exports.searchProductsByText = async (req, res) => {
  const text = req.body.text;
  let searchText = text.trim();
  try {
    const products = await Product.find({
      $text: {
        $search: searchText,
      },
    })
      .populate("categoryId")
      .populate("brand")
      .exec();
    if (products) {
      res.status(200).json({ products: products });
    }
  } catch (error) {}
};
//get products by sold
exports.handleBestProduct = async (req, res) => {
  const { sort, order, limit } = req.body;
  try {
    const products = await Product.find({})
      .populate("categoryId")
      .populate("brand")
      .sort([[sort, order]])
      .limit(limit)
      .exec();
    if (products) {
      res.status(200).json({ products });
    }
  } catch (error) {}
};
//get related product by related product id
exports.relatedProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id },
    categoryId: product.categoryId,
  })
    .limit(3)
    .populate("categoryId")
    .populate("reviews.postedBy")
    .populate("brand");
  res.status(200).json(related);
};
