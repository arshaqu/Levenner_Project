const User =  require ('../Models/userModel')
const Product = require ('../Models/productModel')
const Cart = require ("../Models/cartModel")
const Address = require ('../Models/addressModel')
const Order = require('../Models/orderModel')
const { ObjectId } = require('mongoose').Types;


 const placeorder = async (req,res)=>{
    try {
        const userData = await User.find({_id:req.body.userId})
        const addressData = await Address.find ({userId : req.body.userId})
        const productData = await Product.find({productId :req.body.productid})
        const cartData = await Cart.find({cartId : req.body.cartid})
    const total = await Cart.aggregate([{$match:{userId:req.body.userId}},{$unwind:"$products"},{$project:{productPrice:"$products.productPrice", cou:"$products.eventPeriod"}},{$group:{_id:null,total:{$sum:{$multiply:["$productPrice","$cou"]}}}}])    
        console.log(total[0].total);
        const order = new Order({
            deliveryAddress : addressData[0].address,
            userId:req.body.userId,
            userName : userData[0].name,
            paymentId:'uyui',
            products:cartData[0].products,
            totalAmount:total[0].total,
            Amount:total[0].total,
            history:'Pending',
            date : new Date(),
            status : false,
        })
        const orderData = await order.save()
        // console.log(orderData);
        if(orderData){
            res.status(200)
            .send({message: "product Ordered successfully" ,orderData})
        }
        else{
            res.status(404)
            .send({message:"order not sett"})
        }
    } catch (error) {
        console.log(error);
    }
 }



 const getorder = async (req, res) => {
    try {
        const orderDatas = await Cart.findOne({ userId: req.body.userId });
        const addresData = await Address.find({userId:req.body.userId})
        const total = await Cart.aggregate([{$match:{userId:req.body.userId}},{$unwind:"$products"},{$project:{productPrice:"$products.productPrice", cou:"$products.eventPeriod"}},{$group:{_id:null,total:{$sum:{$multiply:["$productPrice","$cou"]}}}}])    
      console.log(addresData);
        const Total = total[0].total;
        console.log(Total);
        res.status(200).send({ success: true, data: orderDatas,addresData,Total});
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
}


const updateStatus = async (req, res) => {
    try {
        const orderDatas = await Order.updateOne(
            { _id: req.body.id },
            { $set: {
                paymentId: req.body.payment_id,
                status: true 
                }
             },
        );
        
        const cardDlt = await Cart.findOneAndDelete({ userId: req.body.userId });
if (cardDlt) {
    console.log('Cart deleted successfully:', cardDlt);
} else {
    console.log('Cart not found or already deleted.');
}
        if (!orderDatas) {
            return res.status(404).send({ success: false, error: 'Order not found' });
        }
        res.status(200).send({ success: true,  });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
};







    const showorders = async (req,res)=>{
     try {
        const orderData = await Order.find({userId : req.body.userId})
        // console.log(orderData);
        if(orderData){
            res.status(200).send({message:"Fetched the data successfully",orderData})
        }
        else{
            res.status(404)
            .send({message:"Can't Fetch the order data"})
        }
     } catch (error) {
        console.log(error);
     }
    }



    const adminshoworder = async(req,res)=>{
        console.log("reach");
        try {
            const orderData = await Order.find()
            
            console.log(orderData);
            if(orderData){
                res.status(200)
                .send({message:'fetch the order succesfully',success:true,orderData})
            }
            else{
                res.status(404)
                .send({message:"Can't fetch the data",success:false})
            }
        } catch (error) {
            console.log(error);
        }
    }


    const cancelorder = async(req,res)=>{
        console.log(req.body);
        try {
            const orderId = req.body.orderId
            const userData = await User.findOne({ _id: req.body.userId})
            const orderData = await Order.findOne({ _id:orderId})
            const userWallet = userData.wallet;
            console.log(orderData,"-------------------------------");
            if(orderData.status === true){
                const totalWallet = orderData.Amount+userWallet
                console.log(totalWallet);
                const updateUserwallet = await User.findOneAndUpdate({_id:req.body.userId},{$set:{wallet:totalWallet}})
                const canceled = await Order.findOneAndUpdate({_id:req.body.orderId},{$set:{history:'Cancelled'}})
                res.status(200)
                .send({message:"order deleted and wallet updated",success:true})
            }
            else{
                const totalWallet = orderData.Amount+userWallet
                const updateUserwallet = await User.findOneAndUpdate({_id:req.body.userId},{$set:{wallet:totalWallet}})
                const canceled = await Order.findOneAndUpdate({_id:req.body.orderId},{$set:{history:'Cancelled'}})
                res.status(200)
                .send({message:"order deleted and wallet updated",success:true})
            }
        } catch (error)  {
          console.log(error);
        }
      }


      const checkWalletBalance = async (req,res)=>{
          console.log("hereee");
          try {

        } catch (error) {
          console.log(error);  
        }
      }

      const orderDetails = async (req,res)=>{
        const orderid = req.body.id
        try {
            const orderData = await Order.find({_id:orderid})
            res.status(200)
            .send({message:"Order Data fetched successfully",orderData})
        } catch (error) {
            console.log(error);
        }
    }


 module.exports = {
    placeorder,
    getorder,
    updateStatus,
    showorders,
    adminshoworder,
    cancelorder,
    checkWalletBalance,
    orderDetails
 };
