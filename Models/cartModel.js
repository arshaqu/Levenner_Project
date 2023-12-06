const mongoose = require ('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        ref:"user"
    },
    userName:{
        type:String,
        required:true
    },  
    products : [{
        productid:{
            type:String,    
            required:true,
            ref:'product'
        },
        productName:{
            type:String,
            required:true
        },
        eventDate:{
            type:String,    
            required:true
        },
        eventPeriod:{
            type:Number,
            required:true 
        },
        productImage:{
            type:[String],
            required:true
        },
        productColor:{
            type:String,
            required:true
        },
        productCatagory:{
            type:String,
            required:true
        },
        count:{
            type:Number,
            default:1,
        },
        productPrice:{
            type: Number,
            required:true
        },
        productDescription:{
            type:String,
            required:true
        },
        totalPrice:{
            type:Number,
            default:0
        },
        productModel: {
            type: String,
            required: true,
        }
        }]
})


    module.exports = mongoose.model('cart',cartSchema);