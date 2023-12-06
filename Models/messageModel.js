const mongoose = require("mongoose")




const Message = new mongoose.Schema({
    fromId:{
        type:String,
        required:true
    },
    toId:{
        type:String,
        required:true
    },
    ConnectionId:{
        type:String,
        required:true
        
    },
    senderId:{
        type:String
    },
    message:{
        type:String,
        required:true

    }
},{
    timestamps:true
})

module.exports = mongoose.model("messages",Message)