const user = require("../Models/userModel");

const Address = require("../Models/addressModel")


const insertAddress = async(req, res) => {
  try {
    if (!req.body.values) {
      return res.status(400).send({ error: 'Address is required', success: false });
    }

    const existingAddress = await Address.findOne({ userId: req.body.userId });

    if (existingAddress) {
     try {
      existingAddress.userName = req.body.values.name;
      existingAddress.mobile = req.body.values.phone;
      existingAddress.alternativeNumber = req.body.values.alternative;
      existingAddress.pincode = req.body.values.post;
      existingAddress.city = req.body.values.city;
      existingAddress.area = req.body.values.area;
      existingAddress.address = req.body.values.address;
      const updatedAddress = await existingAddress.save();
      res.status(200).send({ message: 'Address updated successfully', success: true });
      console.log("updated successfully");
     } catch (error) {
      console.error("Error:", error);

     }

    } else {
     try {
      const address = new Address({
        userId: req.body.userId,
        userName: req.body.values.name,
        mobile: req.body.values.phone,
        alternativeNumber: req.body.values.alternative,
        pincode: req.body.values.post,
        city: req.body.values.city,
        area: req.body.values.area,
        address: req.body.values.address
      });

      const addressData = await address.save();
      res.status(200).send({ message: 'Address saved successfully', success: true });
      console.log("added address successfully");
     } catch (error) {
    console.error("Error:", error);
      
     }

    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: 'Internal server error', success: false });
  }
};


  const profileDetails = async(req,res)=>{
    try {
      const addressData = await Address.find({userId:req.body.userId})
      const userData = await user.find({_id : req.body.userId})
      res.status(200)
      .send({message:"Address Fetched Successfully",addressData,userData});
      
    } catch (error) {
      console.log(error);
    }
  }


  const getProfile = async(req,res)=>{
    // const existingAddress = await Address.findOne({ userId: req.body.userId });
    try {
      const addressData = await Address.find({userId:req.body.userId})
      const userData = await user.find({name : addressData.name})
      console.log("fdfds",userData)
      res.status(200)
      .send({message:"Address Fetched Successfully",addressData,userData});
      
    } catch (error) {
      console.log(error);
    }
  }


    const editProfile = async(req,res)=>{
      try {
        if (!req.body.values) {
          return res.status(400).send({ error: 'Address is required', success: false });
        }
    
        const existingAddress = await Address.findOne({ userId: req.body.userId });
    
        if (existingAddress) {
         try {
          existingAddress.userName = req.body.values.name;
          existingAddress.mobile = req.body.values.phone;
          if (req.body.values.alternative) {
            existingAddress.alternativeNumber = req.body.values.alternative;
          }
          existingAddress.pincode = req.body.values.post;
          existingAddress.city = req.body.values.city;
          existingAddress.area = req.body.values.area;
          existingAddress.address = req.body.values.address;
          const updatedAddress = await existingAddress.save();
          res.status(200).send({ message: 'Address updated successfully', success: true });
          console.log("updated successfully");
         } catch (error) {
          console.error("Error:", error);
    
         }
    
        } else {
         try {
          const address = new Address({
            userId: req.body.userId,
            userName: req.body.values.name,
            mobile: req.body.values.phone,
            alternativeNumber: req.body.values.alternative ? req.body.values.alternative : '',
            pincode: req.body.values.post ? req.body.values.pincode : '',
            city: req.body.values.city,
            area: req.body.values.area,
            address: req.body.values.address
          });
    
          const addressData = await address.save();
          res.status(200).send({ message: 'Address saved successfully', success: true });
          console.log("added address successfully");
         } catch (error) {
        console.error("Error:", error);
          
         }
    
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Internal server error', success: false });
      }
    }


      

module.exports = {
    insertAddress,
    profileDetails,
    editProfile,
    getProfile,
  }