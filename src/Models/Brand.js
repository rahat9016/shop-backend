const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Too short"],
      maxlength: [32, "Too Long"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    brandLogo: {},
    brandCover: [{ img: { type: String }, public_id: { type: String } }],
    description: {
      type: String,
    },
    createBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Brand", brandSchema);
