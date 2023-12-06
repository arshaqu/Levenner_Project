const mongoose = require ('mongoose')

const addressSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        ref:'user'
    },
    userName:{
        type:String,
        required :true,
    },
    mobile:{
        type:Number,
        required:true
    },
    alternativeNumber:{
        type:String,
        required:true
    },
     pincode:{
        type:String,
        required : true
     },
     city:{
        type:String,
        required:true
     },
     area:{
        type:String,
        required:true
     },
     address : {
        type:String,
        required:true
     }

})


    // const addressModel = mongoose.model('address',addressSchema)
    module.exports = mongoose.model('address',addressSchema);
