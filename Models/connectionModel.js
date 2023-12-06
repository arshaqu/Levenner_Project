const mongoose = require("mongoose")


const connection = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    adminId:{
        type:String,
        required:true
    },
    lastmessage:{
        type:String
    }
},{
    timestamps:true
})

module.exports = mongoose.model("connection",connection);