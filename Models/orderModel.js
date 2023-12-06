
const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    deliveryAddress : 
    {   type:String,
        required :true
    },
    userId :{
        type :String,
        required : true
    },
    userName:{
        type:String,
        required:true
    },
    
    paymentId:{
        type : String
    },
    products:[{
         productid:{
         type :String,
         ref : "Product"
         },
         count:{
            type:Number,
            default:1
         },
         eventDate:{
            type:Date
         },
         eventPeriod:{
            type:Number
         },
         productPrice:{
            type:Number,
         },
         productImage:{
            type:[String],
         },
         productName:{
            type :String
         },
         productColor:{
            type:String
         },
         productCatagory:{
            type:String
         },
         totalPrice:{
            type:Number,
            default : 0
         }
    }],
    totalAmount:{
        type: Number,
        required :false,
    },
    Amount :{
        type : Number,
        required : true
    },
    history:{
            type:String,
            default:''
    },
    date :{
        type : Date
    },
    status : {
        type : Boolean,
        default : false
    },
    orderWallet:{
        type:Number
    }
 
},{
    timestamps : true 
}
)

module.exports  = mongoose.model('order' , orderSchema)