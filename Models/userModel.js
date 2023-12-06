const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    }, 
    otp:{
        type : String,
        default :"0"
      },
    isVerified:{
        type:Boolean,
        default:false
      },
      token :{
        type : String,
        default: ''
      },
      wallet:{
        type:Number,
        default:0
    },
      blocked:{
        type:Boolean,
        default : false
      }
      ,changed:{
        type:Boolean,
        default:false
      }
},{
    timestamps : true
})

const userModel = mongoose.model('users',userSchema);
    
    module.exports = userModel;