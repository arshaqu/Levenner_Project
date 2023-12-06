const mongoose = require ('mongoose')

const ProductSchema = new mongoose.Schema({
    product :{
        type : String,
        required : true
    },
    stock:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    },
    image:{
        type:[String],
    },
    catagory:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:false
    },
    size:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    softdelete:{
        type:Boolean,
        default:false
    }
})

    module.exports = mongoose.model('Product',ProductSchema);