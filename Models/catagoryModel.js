const mongoose = require ('mongoose')

const CategorySchema = new mongoose.Schema({
    catagoryName:{
        type:String,
        required : true
    },
    status:{
        type: Boolean,
        default :true
    }
})
module.exports = mongoose.model('Catagory',CategorySchema);