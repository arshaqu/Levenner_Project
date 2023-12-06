const Connection = require("../Models/connectionModel");
const Message = require("../Models/messageModel")

const Admin = require("../Models/adminModel")


const submitMessage =async(req,res)=>{  
    console.log("reached herer");
    // console.log(req.body.inputdata);
    try {

const adminData = await  Admin.findOne()

            const userId = req.body.userId
        const message = req.body.inputdata
            const adminId = adminData._id
            const senderId = req.body.userId
        console.log(message);

    var connections = await Connection.findOne({userId:userId,adminId:adminId})
    if(!connections){
        const Conn = new Connection({
            userId:userId,
            adminId:adminId,
           
            lastmessage:message,
        
        })
        connections =  await Conn.save()
        
    }
     await Connection.updateOne({userId:userId,adminId:adminId},{$set:{lastmessage:message}})
    const messageSubmit= new Message({
        fromId:userId,
        toId:adminId,
        senderId:senderId,
        ConnectionId:connections._id,
        message:message
    })

  const data = await   messageSubmit.save()
res.status(200).send({
    data,
   connection:connections._id,
   adminId,
   userId
})

} catch (error) {
    console.log(error.message);
}

}

const getAllmessage = async(req,res)=>{
    console.log(req.body);
    try {
        console.log("workssss");
        const adminData = await  Admin.findOne()
        // const senderId = await A 
console.log(adminData);
        const userId = req.body.userId
        const adminId = adminData._id
        
        console.log(userId);


      const connection =  await Connection.findOne({userId:userId,adminId:adminId})
      const messages = await Message.find({ConnectionId:connection._id})
        
        console.log(messages ,"--------------------------------");
      res.status(200).
      send({
        messages,
        userId,
        adminId,
        connection
      })


    } catch (error) {
        console.log(error.message);
    }
}

const adminSubmit = async(req,res)=>{

try {
    const adminData = await  Admin.findOne()

    const userId = req.body.userId
    const message = req.body.inputData
    const adminId = adminData._id
    const senderId = adminData._id
    

    var connections = await Connection.findOne({userId:userId,adminId:adminId})
    if(!connections){
        const Conn = new Connection({
            userId:userId,
            adminId:adminId,
            lastmessage:message,
        })
        connections =   await Conn.save()
    }

    const messageSubmit= new Message({
        fromId:adminId,
        toId:userId,
        senderId:senderId,
        ConnectionId:connections._id,
        message:message
    })
    console.log("gyh",userId);

  const data =  await messageSubmit.save()
    res.status(200).send({
        data,
       connection:connections._id,
       adminId,
       userId
    })


} catch (error) {
    console.log(error.message);
}

}

const ChatList = async(req,res)=>{
    try {
        
      
     const connections  = await Connection.find().populate("userId")

     res.status(200).send({
        data:connections
     })


    } catch (error) {
        console.log(error.message);
    }}


module.exports  = {
    submitMessage,
    getAllmessage,
    adminSubmit,
    ChatList
}