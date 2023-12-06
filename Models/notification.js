const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId:{
        type : String
    },
    notificationMessage:{
        type:String
    },
    date:{
        type:Date
    },
    seen:{
        type:Boolean,
        default:false
    }



},
{
    timestamps:true
})

 const notificationModel= mongoose.model('notification',notificationSchema)
 module.exports =notificationModel