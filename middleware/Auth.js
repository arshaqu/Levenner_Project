const jwt = require ('jsonwebtoken')

module.exports = (req,res,next)=>{

  try { 
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err)
            return res.status(401).send({
                message:'Auth Failed',
                success: false
            })
        }else{
            req.body.adminId = decoded.id;
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