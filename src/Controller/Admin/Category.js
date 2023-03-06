const shortid = require("shortid");
const slugify = require("slugify");
const { uploadSingleImage } = require("../../Common/cb_connection");
const { deleteImg } = require("../../Common/cloudDinary");
const Category = require("../../Models/Category");

exports.addCategory = async (req, res) => {
  const { title, parentId } = req.body;
  let imageUpload;
  if (req.file) {
    imageUpload = await uploadSingleImage(req, res);
  }
  try {
    const categoryObj = {
      title: title,
      slug: `${slugify(title)}-${shortid.generate()}`,
    };
    if (imageUpload) {
      categoryObj.categoryImg = imageUpload;
    }
    if (parentId) {
      categoryObj.parentId = parentId;
    }
    const category = await new Category(categoryObj);
    category.save((error, cat) => {
      if (error)
        return res.status(400).json({ error: "Already category created!" });
      else if (cat) {
        res.status(201).json({
          message: "Category create successfully",
          category: cat,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).populate("parentId").exec();
    if (categories) {
      function recursionFunction(categories, parentId = null) {
        let category;
        let categoryList = [];
        if (parentId == null) {
          category = categories.filter((cat) => cat.parentId == undefined);
        } else {
          category = categories.filter(
            (cat) => parentId == cat.parentId?._id.toString()
          );
        }
        for (let cate of category) {
          categoryList.push({
            _id: cate._id,
            title: cate.title,
            slug: cate.slug,
            categoryImg: cate.categoryImg,
            parentId: cate?.parentId || undefined,
            children: recursionFunction(categories, cate._id.toString()),
          });
        }
        return categoryList;
      }
      const categoriesItem = recursionFunction(categories);
      res.status(200).json({ category: categoriesItem });
    }
  } catch (error) {}
};

exports.updateCategory = async (req, res, next) => {
  const { id, title, categoryImg, parentId } = req.body;
  let imageUpload;
  if (req.file) {
    imageUpload = await uploadSingleImage(req, res);
  }
  // console.log(categoryImg);
  try {
    await Category.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          title: title,
          parentId: parentId ? parentId : null,
          categoryImg: imageUpload || categoryImg,
        },
      }
    ).exec((error, updated) => {
      res.status(200).json({ message: "Category Updated" });
      // console.log({ error, updated });
    });
  } catch (error) {}
};
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({ _id: req.params.id }).exec(
      (error, deleteItem) => {
        const img = deleteItem?.categoryImg;
        if (img) {
          deleteImg(img.id);
        }
        if (deleteItem) {
          res.status(204).json({ deleteItem: deleteItem });
        }
      }
    );
  } catch (error) {}
};
