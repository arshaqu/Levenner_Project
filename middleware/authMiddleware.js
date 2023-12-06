const jwt = require ('jsonwebtoken')
const Users = require("../Models/userModel")

module.exports = (req,res,next)=>{

  try { 
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
      const user = await Users.findOne({_id:decoded?.id})
        if(err){
            console.log(err,"errr")
            return res.status(401).send({
                message:'Auth Failed',
                success: false
            })
        }else{
          
            req.body.userId = decoded?.id;
            next();
        }
    })
  } catch (error) {
    console.log(error);
    return res.status(401).send({
        message:"Auth failed",
        success:false
    })
  }
}