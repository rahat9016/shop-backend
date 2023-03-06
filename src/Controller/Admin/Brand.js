const slugify = require("slugify");
const shortid = require("shortid");
const Brand = require("../../Models/Brand");
const { uploadSingleImage } = require("../../Common/cb_connection");

exports.brandCreate = async (req, res) => {
  const { name, description } = req.body;
  let imageUpload;
  if (req.file) {
    imageUpload = await uploadSingleImage(req, res);
  }
  try {
    let brandObj = {
      name: name,
      slug: `${slugify(name)}-${shortid.generate()}`,
      description: description,
      createBy: req.user._id,
    };
    if (imageUpload) {
      brandObj.brandLogo = imageUpload;
    }
    const brand = await new Brand(brandObj);
    brand.save((error, brand) => {
      if (error) return res.status(400).json({ error: error });
      if (brand) {
        res.status(201).json({
          message: "Brand create successful!",
          brand: brand,
        });
      }
    });
  } catch (error) {
    console.log("Brand Error ----->", error);
  }
};
exports.getAllBrand = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    if (brands) {
      res.status(200).json({
        brands,
      });
    }
  } catch (error) {}
};
exports.deleteBrand = async (req, res) => {
  const params = req.params.id;
  try {
    await Brand.findOneAndDelete({ _id: params }).exec((error, deleteBrand) => {
      if (error) return res.status(400).json({ error: error });
      if (deleteBrand) {
        res.status(200).json({
          message: "Brand Delete successful!",
        });
      }
    });
  } catch (error) {}
  console.log(params);
};
