const express = require ('express')
const adminRouter = express.Router();
const upload = require('../Config/multer')
const adminControllers = require('../Controllers/adminController');
const catagoryControllers = require ('../Controllers/catagoryController')
const productControllers = require ('../Controllers/productController')
const orderController = require('../Controllers/orderController')
const userControllers = require ('../Controllers/userController')
const auth = require('../middleware/Auth')
const ChatController = require("../Controllers/chatController")


adminRouter.post('/listCategory',auth,catagoryControllers.listCategory);
adminRouter.post('/productList',auth,productControllers.productList);
adminRouter.post('/userList',auth,userControllers.userList);
adminRouter.post('/catagoryfind',auth,catagoryControllers.catagoryfind);
adminRouter.post('/catagoryupdate',auth,catagoryControllers.catagoryupdate);
adminRouter.post('/catdelete',auth,catagoryControllers.catdelete);
adminRouter.post('/deleteProduct',auth,productControllers.deleteProduct);
adminRouter.post('/editProduct',auth,productControllers.editProduct);


adminRouter.post('/isblocked',auth,adminControllers.isblocked)

adminRouter.post('/adminLogin',adminControllers.adminLogin)
// adminRouter.post('/admin/blockUser/:userId',adminControllers.blockUser)
adminRouter.post('/addCatagory',auth,catagoryControllers.insertCatagory)
adminRouter.post('/orderlist',auth,orderController.adminshoworder)
adminRouter.post('/productAdd',upload.upload.array('image',10),productControllers.insertProduct)

adminRouter.post("/submit",ChatController.adminSubmit)
adminRouter.get("/connections",ChatController.ChatList)
adminRouter.post("/getchatdata",ChatController.getAllmessage)
adminRouter.get("/getDataToDash",adminControllers.getDataToDash)

module.exports = adminRouter