const Admin = require('../Models/adminModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const users  = require("../Models/userModel")
const Orders = require("../Models/orderModel")
const Product = require("../Models/productModel")


const adminLogin = async (req, res) => {
    try{

        // console.log("hii")
        // const password = req.body.password
        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(password , salt)
        // req.body.password = hashedPassword
        // const email = req.body.email
        // const admin = new Admin(
            //     {
                //         email:email,
                //         password:req.body.password
                //     }
                // )
                //    const abc= await admin.save()
                //    console.log(abc)
                const admin = await Admin.findOne({ email: req.body.email });
                // console.log(admin);
                
                if (!admin) {
                    return res
                    .status(200)
                    .send({ message: "Please Enter the Valid details", success: false })
                }
                const passwordMatch = await bcrypt.compare(req.body.password, admin.password)
                
                if(!passwordMatch){
                    return res
                    .status(200)
                    .send({ message : "Please Enter a Valid Password" , success: false})
                }
                else{
                    const admintoken = jwt.sign({id: admin._id}, process.env.JWT_SECRET ,{expiresIn : "1d"})
                    res
                    .status(200)
                    .send({ message: "Login Succesfully" ,success: true , data: admintoken})
                }
            }
    catch(error) {
    res.status(500)
    .send({ message:"Error in Login " ,success:false ,error})
    }
}



const isblocked = async (req,res)=>{
    console.log("reach");
    console.log(req.body  );


    try {
        console.log("jii");
if(req.body.blocked===false){
    await users.findOneAndUpdate({_id:req.body.id},{$set:{blocked:true}})
    // localStorage.removeItem('blocked');
    res.status(200).send({message:"User Blocked SuccesFully",success:true})
}else{
    await users.findOneAndUpdate({_id:req.body.id},{$set:{blocked:false}})
    res.status(404).send({ message:"User unblock Succesfully",success:false})
}
res.status(200).send({success:success,blocked:req.body.blocked})
        
    } catch (error) {
        
    }
}

// const blockUser = async (req,res) =>{
//     console.log("hiii");
//     const {userId} = req.params;
//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//           return res.status(404).json({ success: false, error: 'User not found' });
//           user.blocked = true;
//           await user.save();
//         }
//         res.status(200).send({ success: true, message: 'User blocked successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, error: 'Internal Server Error' });
//     }
// }


const getDataToDash = async (req, res) => {
    try {
      const userCount = await users.countDocuments({});
    //   const developerCount = await Developer.countDocuments({})
      const revenueByMonth = {};
      const sales = await Orders.countDocuments({})
      const product = await Product.countDocuments({})
      console.log(product);
    //   const developerData = await Developer.find({})
    const cancelled = await Orders.countDocuments({history:'Cancelled'})
    console.log(cancelled);
  
  
  
    const aggregationPipeline = [
        {
          $match: {} // can add match conditions here if needed
        },
        {
          $unwind: '$history'
        },
        {
          $group: {
            _id: null,
            totalPayment: {
              $sum: {
                $cond: {
                  if: { $eq: ['$history', 'Cancelled'] },
                  then: 0, // Subtract 0 for 'Cancelled' history
                  else: '$totalAmount'
                }
              }
            },
            paymentByMonth: {
              $push: {
                date: '$date',
                price: '$totalAmount'
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalPayment: 1,
            paymentByMonth: 1
          }
        }
      ];
  
  
    //   const subscrib = await subscriptionPayedModel.countDocuments({})
  
  
      const aggregationResult = await Orders.aggregate(aggregationPipeline);
      
      if (aggregationResult.length === 0) {
          return res.status(200).send({ success: true, user: userCount, developer: developerCount, sub: subscrib, totalPayment: 0, paymentByMonth: [] });
        }
        
        const { totalPayment, paymentByMonth } = aggregationResult[0];
        
        console.log("aggree",aggregationResult);
  
      res.status(200).send({ success: true, user: userCount, totalPayment, paymentByMonth,sales,cancelled,aggregationResult });
  
      const user = await users.find({})
    } catch (error) {
      console.log(error, "At getDataToDash")
      res.status(500).send({ message: "some thing went wrong", success: false })
  
    }
  }

module.exports = {
    adminLogin,
    isblocked,
    getDataToDash
    

}