const Product = require("../Models/productModel");
const Catagory = require("../Models/catagoryModel");
const Order = require('../Models/orderModel')



const insertProduct = async (req, res) => {
  try {
    const images = req.files.map((file) => file.filename);
    const newProduct = new Product({
      product: req.body.product,
      color: req.body.color,
      size: req.body.size,
      price: req.body.price,
      model: req.body.modelnumber,
      stock: 10,
      image: images,
      catagory: "adfsd",
      description: req.body.description,
    });
    const productData = await newProduct.save();
    if (productData) {
      res
        .status(200)
        .send({ message: "Product Added Successfully", success: true });
    } else {
      res
        .status(500)
        .send({ message: "Product could not be added", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};


const productList = async (req, res) => {
  try {
    const product = await Product.find({softdelete:false});
    res.send(product);
  } catch (error) {
    console.log(error);
  }
};


const outfitList = async (req, res) => {
  try {
    const product = await Product.find({softdelete:false});
    // const userData = await User.findOne({token:token})
    console.log(product)
    res.send({ product });
  } catch (error) {
    console.log(error);
  }
};


const Outfitdetails = async (req, res) => {
  try {
    // console.log('hii');
    console.log(req.body);
    const product = await Product.findOne({ _id: req.body.id });
    // console.log(product);
    res.send({ product });
  } catch (error) {
    console.log(error);
  }
};


const bookedDates = async (req,res) =>{
  try {
    const dateArr =[]
    const productArr = []
    const orderData = await Order.find()
    console.log("hii",orderData[0]);
    console.log(orderData.products)
    const products = orderData.products;
    for(let i=0;i<orderData.length;i++){
      let sample = orderData[i];
      productArr.push(sample.products)
    }
    console.log(productArr);

    for (let i = 0; i < productArr.length; i++) {
      let samples = productArr[i];
      if (Array.isArray(samples) && samples.length > 0 && samples[0].eventDate) {
        dateArr.push(samples[0].eventDate);
      }
    }
    console.log(dateArr);

    res.status(200)
    .send({message:"order fetched successfully",dateArr})
  } catch (error) {
    console.log(error);
  }
}

// const getproductdates = async (req, res) => {
//   try {
//     const productid = req.query.id;

//     // Find orders that have the specified productid in their products array
//     const orders = await Order.find({ "products.productid": productid });
//     console.log(orders);
//     // Extract eventDate values from the products array
//     const dateArr = orders.reduce((acc, order) => {
//       const product = order.products.find((p) => p.productid === productid);
//       if (product) {
//         acc.push(product.eventDate);
//       }
//       return acc;
//     }, []);

//     if (dateArr.length > 0) {
//       console.log(dateArr);
//       res.status(200).send(dateArr);
//     } else {
//       res.status(404).send({ message: "No dates found for the given productid" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };





const getproductdates = async (req, res) => {
  try {
    let dateArr = [];
    const productid = req.query.id;
    const orderdata = await Order.find( {_id:productid});
    if(orderdata) {
      for(let i=0;i<orderdata.length;i++){
        let sample = orderdata[i];
        let products = sample.products;
        for(let j=0;j<products.length;j++){
          let sample2 = products[j];
          if(sample2.productid==productid){
            dateArr.push(sample2.eventDate);
          }
        }
      }
      if(dateArr.length>0){
        
        console.log(dateArr);
       const date = dateArr

        // const datas = dateArr.map(dateString => new Date(dateString));
        res.status(200).send(dateArr);
      }else{
        res.json({message:"No dates found for this product"});
      }
    }else{
      res.json({message:"No order for this product"})
    }
    // console.log(orderdata, productid);
  } catch (error) {
    console.log(error.message);
  }
}

  const deleteProduct = async(req,res)=>{
    const id = req.body.data._id
    console.log(id);
    try {
      const deletePro = await Product.findByIdAndUpdate({_id:id},{$set:{softdelete:true}})
      res.status(200).send({message:"Product deleted Successfully",success:true})
    } catch (error) {
      console.log(error);
    }
  }


  const editProduct = async (req,res) =>{
   console.log("jiij",req.body);
  //  console.log(req.body.data);
   const ProductId = req.body.data
   const productData = req.body.values
    try {
      const updateData = await Product.findOneAndUpdate({_id:ProductId},{$set:{
      product: productData.product,
      color: productData.color,
      size: productData.size,
      price: productData.price,
      model: productData.model,
      stock: productData.stock,
      description: productData.description,
      }})
        res.status(200).send({message:"Product Updated Successfully",success:true})
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
  insertProduct,
  productList,
  outfitList,
  Outfitdetails,
  bookedDates,
  getproductdates,
  deleteProduct,
  editProduct
};
