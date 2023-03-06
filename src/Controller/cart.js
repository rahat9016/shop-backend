const Cart = require("../Models/Cart");
const User = require("../Models/User");

exports.userCart = async (req, res) => {
  const { cart } = req.body;
  // console.log(cart);
  let products = [];
  const user = await User.findOne({ _id: req.user._id }).exec();

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i].product_id;
    object.quantity = cart[i].quantity;
    object.price = cart[i].price;
    products.push(object);
  }
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].quantity;
  }
  let newCart = await Cart({
    products,
    cartTotal,
    orderBy: user._id,
  });
  newCart
    .save()
    .then((newCart) => {
      res.status(201).json({
        message: "Cart Added in DB",
        cartItem: newCart,
      });
    })
    .catch((error) => {
      if (error) return res.status(400).json({ error: error });
    });
};
exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).exec();
  const cart = await Cart.findOne({ orderBy: user._id })
    .populate("products.product", "_id name price ")
    .exec();
  res.status(200).json({ cart });
};
