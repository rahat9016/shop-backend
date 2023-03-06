const { default: slugify } = require("slugify");
const { uploadMultipleImage } = require("../../Common/cb_connection");
const { deleteImg } = require("../../Common/cloudDinary");
const Product = require("../../Models/Product");
const User = require("../../Models/User");
exports.addProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    quantity,
    categoryId,
    brand,
    shipping,
    color,
    keyFeature,
  } = req.body;
  let uploadImages;
  if (req.files) {
    uploadImages = await uploadMultipleImage(req);
  }
  let productKeyFeatures = [];

  // console.log(keyFeature[0]);
  if (keyFeature !== undefined) {
    for (i = 0; i < keyFeature.length; i++) {
      productKeyFeatures.push({ key: keyFeature[i] });
    }
  }
  // console.log(keyFeature);
  try {
    const slug = slugify(name);
    if (name) {
      const product = await new Product({
        name,
        slug,
        price,
        description,
        quantity,
        categoryId,
        shipping,
        color,
        brand,
        createBy: req.user._id,
        productPictures: uploadImages,
        keyFeatures: productKeyFeatures,
      });
      product.save((error, product) => {
        if (error) return res.status(400).json({ error: error });
        if (product) {
          res.status(201).json({
            message: "Product create successful!",
            product: product,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("categoryId", "_id title slug parentId")
      .populate("brand")
      .exec();
    res.status(200).json({ products: products });
  } catch (error) {}
};
exports.getProductById = async (req, res) => {
  try {
    const data = await Product.findById({ _id: req.params.id })
      .populate("brand")
      .populate("reviews.postedBy")
      .exec();
    if (data) {
      res.status(200).json({ product: data });
    }
  } catch (error) {
    if (error) return res.status(400).json({ error });
  }
};

// Remove product
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await Product.findByIdAndDelete({ _id: id }).exec((error, data) => {
      if (error) return res.status(400).json({ error });
      const pictures = data?.productPictures;
      if (pictures !== undefined) {
        for (let pic of pictures) {
          if (pic) {
            deleteImg(pic.id);
          }
        }
      }
      if (data)
        return res
          .status(204)
          .json({ message: "Product Deleted successful", data });
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong!", error });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  let productPictures = [];
  if (req.files.length > 0 && req.files) {
    productPictures = req.files.map((file) => {
      return { img: process.env.API + "/public/" + file.filename };
    });
  }
  try {
    await Product.findById({ _id: id }).exec(async (error, product) => {
      if (error) return res.status(400).json({ error: error });
      else if (product) {
        const updated = await Product.findByIdAndUpdate(
          { _id: id },
          { $set: { ...req.body, productPictures } },
          {
            new: true,
          }
        ).exec();
        console.log(updated);
        res.status(200).json(updated);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
exports.productCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.status(200).json({ total });
};
// product review
exports.productStart = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ _id: req.user._id }).exec();
  const { star } = req.body;
  let existingRatingObject = product.reviews.find(
    (ele) => ele.postedBy.toString() === user._id.toString()
  );
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { reviews: { star: star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    res.json(ratingAdded);
  } else {
    const ratingUpdated = await Product.updateOne(
      { reviews: { $elemMatch: existingRatingObject } },
      {
        $set: { "reviews.$.star": star },
      },
      {
        new: true,
      }
    ).exec();
    res.status(200).json({ ratingUpdated });
  }
};

// const handleQuery = async (req, res, query) => {
//   const products = await Product.find({ $text: { $search: query } })
//     .populate("categoryId")
//     .populate("brand")
//     .sort([["createdAt", "desc"]])
//     .exec();
//   res.status(200).json({ products: products });
// };
// const handlePaginationProduct = async (req, res, page, perPage) => {
//   try {
//     const currentPage = page || 1;
//     // const perPage = 6;
//     const products = await Product.find({})
//       .skip((currentPage - 1) * perPage)
//       .populate("categoryId")
//       .populate("brand")
//       .sort([["createdAt", "desc"]])
//       .limit(perPage)
//       .exec();
//     res.status(200).json({ products });
//   } catch (error) {
//     console.table(error);
//   }
// };
exports.searchProducts = async (req, res) => {
  const { query } = req.body;
  if (query) {
    const products = await Product.find({ $text: { $search: query } })
      .populate("categoryId")
      .populate("brand")
      .sort([["createdAt", "desc"]])
      .exec();
    res.status(200).json({ products: products });
  }
};
