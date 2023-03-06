const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      text: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      text: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productPictures: [{ url: { type: String }, id: { type: String } }],
    keyFeatures: [
      {
        key: {
          type: String,
        },
      },
    ],
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    reviews: [
      {
        postedBy: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        star: Number,
        comment: String,
      },
    ],
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      type: String,
      text: true,
    },
    color: {
      type: String,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
productSchema.index(
  {
    name: "text",
    brand: "text",
    description: "text",
  },
  {
    weights: {
      name: 5,
      brand: 5,
      description: 10,
    },
  }
);
module.exports = mongoose.model("Product", productSchema);
