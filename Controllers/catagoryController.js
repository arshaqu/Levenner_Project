const Catagory = require('../Models/catagoryModel')


const insertCatagory = async(req,res)=>{
   
    try {
        const category = req.body.catagory;
        const catName = category.toUpperCase(); 
        const catagory = new Catagory({ catagoryName:catName})
        if(catName.trim().length === 0 ){
            res.status(404)
            .send({message :"Invalid Typing" ,sucess:false})
        }else{
            const catData = await Catagory.findOne({ catagoryName:catName });
            if(catData){
                res.status(404)
                .send({ message:"This Catagory is Already Exist" ,sucess:false})
            }
            else{
                const catagoryData = await catagory.save();
                res.status(200)
                .send({ message:"Catagory added Succesfully",sucess:true})
            }
        }


    } catch (error) {
        console.log(error.message)
    }
}

const listCategory = async (req,res) =>{
    try {
        const category = await Catagory.find({});
        res.send(category)
    } catch (error) {
        console.log(error.message);
    }
}

 const catagoryfind = async(req,res)=>{
     try {
         const catagory = await Catagory.find({_id:req.body.data})
         const catdata = catagory[0].catagoryName
         console.log(catdata);
         res.status(200).send({catdata})
    } catch (error) {
        console.log(error);
    }
 }


 const catagoryupdate = async(req,res) => {
     const catagoryNam = req.body.newCatagory
     const catName = catagoryNam.toUpperCase()

    try {
        const updateCat = await Catagory.findOneAndUpdate({_id:req.body.data},{$set:{catagoryName:catName}})
        res.status(200).send({message:"Catagory updated successfully",success:true})
    } catch (error) {
        console.log(error);
    }
 }


 const catdelete = async (req,res) =>{
    console.log(req.body.data._id);
    const id = req.body.data._id
    try {
        const catDelete = await Catagory.findOneAndDelete({_id:id})
        res.status(200).send({message:"Catagory successfully Deleted",success:true})
       
    } catch (error) {
        console.log(error);
    }
 }


module.exports = {
    insertCatagory,
    listCategory,
    catagoryfind,
    catagoryupdate,
    catdelete
}