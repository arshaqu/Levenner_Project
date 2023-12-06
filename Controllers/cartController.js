const Product = require("../Models/productModel");
const Cart = require("../Models/cartModel");
const user = require("../Models/userModel");

const addtoCart = async (req, res) => {
  try {
    const id = req.body.userId;
    const productData = await Product.findOne({ _id: req.body.id });
    const userName = await user.findOne({ _id:req.body.userId });
    const cartData = await Cart.findOne({ userId: req.body.userId });
    const eventDetails = req.body
    console.log(req.body);
    if (cartData) {
      const proExit = await cartData.products.findIndex(
        (Product) => Product.productid == req.body.id
      );
      if (proExit != -1) {
        await Cart.updateOne(
          { userId: req.body.userId, "products.productid": req.body.id },
          { $inc: { "products.$.count": 1 } }
        );
        res.status(200).send({ success: true });
      } else {
          await Cart.findOneAndUpdate(
          { userId: req.body.userId },
          {
            $push: {
              products: {
                productid: req.body.id,
                productPrice: productData.price,
                productName: productData.product,
                eventDate:req.body.eventDate,
                eventPeriod:req.body.rentPeriod,
                productImage: productData.image,
                productDescription: productData.description,
                productModel : productData.model,
                productCatagory :productData.catagory,
                productStock : productData.stock,
                productColor : productData.color

              },
            },
          }
        );
        res
          .status(200)
          .send({ message: "Product added to cart successfully", success: true });
      }
    } else {

      const cart = new Cart({
        userId: req.body.userId,
        userName: userName.name,
        products: [
          {
            productid: productData._id,
            productName: productData.product,
            eventDate:req.body.eventDate,
            eventPeriod:req.body.rentPeriod,
            productImage: productData.image,
            productPrice: productData.price,
            productDescription: productData.description,
            productModel : productData.model,
            productCatagory :productData.catagory,
            productStock : productData.stock,
            productColor : productData.color
          },
        ],
      });
      const cartData = await cart.save();
      if (cartData) {
        res
          .status(200)
          .send({
            message: "Add Product to Cart successfully",
            success: true,
          });
      } else {
        res
          .status(400)
          .send({
            message: "Product Couldn't be added in to cart",
            success: false,
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getCart = async (req, res) => {
  try {
    const getdata = await Cart.findOne({ userId: req.body.userId });
    if(getdata){
      console.log("get into getdata");
      if(getdata.products.length>0){
        console.log("get into getdata products length", getdata.products.length);
        const product = getdata.products;
        const total = await Cart.aggregate([{$match:{userId:req.body.userId}},{$unwind:"$products"},{$project:{productPrice:"$products.productPrice", cou:"$products.eventPeriod"}},{$group:{_id:null,total:{$sum:{$multiply:["$productPrice","$cou"]}}}}])    
        const Total = total[0].total;
        console.log(Total);
        res.send({ product, Total });
      }else{
        res.json({message: "Products are empty in the cart"})
      }
    }else{
      res.json({message: "Products are empty in the cart"})
    }
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = {
  addtoCart,
  getCart,
};





















// const addtoCart = async (req, res) => {
//   try {
//     const productId = req.body.id;
//     const userId = req.body.userId;
//     const productData = await Product.findOne({ _id: productId });
//     if (!productData) {
//       return res.status(404).json({ message: 'Product not found', success: false });
//     }
//     const user = await User.findOne({ _id: userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found', success: false });
//     }
//     let cart = await Cart.findOne({ userId: userId });
//     if (!cart) {
//       cart = new Cart({ userId, userName: user.name, products: [] });
//     }
//     const productInCart = cart.products.find((item) => item.productid.toString() === productId);
//     if (productInCart) {
//       productInCart.quantity++;
//     } else {
//       cart.products.push({ productid: productId, productPrice: productData.productPrice, quantity: 1 });
//     }
//     await cart.save();
//     return res.status(200).json({ message: 'Product added to cart successfully', success: true });
//   } catch (error) {
//     return res.status(500).json({ message: 'An error occurred', success: false });
//   }
// };

// // Initialize an empty cart array to store products
// let cart = [];

// const loadCart = async (req, res) => {
//   try {
//     console.log("Hey Noo!!");
//     const id = req.body.userId
//     const userName = await user.findOne({_id:req.body.userId})
//     const cartData = await Cart.findOne({ userId:req.body.userId })
//     console.log(cartData);
//     // Find the product using the provided ID
//     const product = await Product.findOne({ _id: req.body.id });

//     if (product) {
//       // Add the product to the cart
//       cart.push(product);
//       console.log(`Product added to cart: ${product.product}`);
//     } else {
//       console.log("Product not found.");
//     }

//     res.send({ product }); // Send the updated cart back to the client
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: "An error occurred." });
//   }
// }
//   const Cart = async(req,res)=>{
//     try {
//       console.log("Hey Noo!!!");
//       const product = await Product.findOne({_id:req.body.id})
//       console.log(req.body.id);

//       console.log(product);
//       res.send({product})
//     } catch (error) {
//       console.log(error);
//     }
//   }
