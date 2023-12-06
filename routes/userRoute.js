const express = require('express');
const userControllers = require('../Controllers/userController')
const productControllers = require('../Controllers/productController')
const cartControllers = require('../Controllers/cartController')
const authMiddleware = require("../middleware/authMiddleware");
const addressControllers = require ('../Controllers/addressController.js')
const orderControllers = require ('../Controllers/orderController')
const chatController = require("../Controllers/chatController.js")


const router = express.Router();
const User = require('../Models/userModel')
const bcrypt = require('bcryptjs')
const multer = require('multer');
const upload = multer()

router.get('/getproductdates',productControllers.getproductdates)
router.post('/orderDetails',orderControllers.orderDetails)


router.post('/outfit',authMiddleware,productControllers.outfitList)
router.post('/getorder',authMiddleware,orderControllers.getorder)
router.post('/updateStatus',authMiddleware,orderControllers.updateStatus)
router.post('/profileDetails',authMiddleware,addressControllers.profileDetails)
router.post('/showorders',authMiddleware,orderControllers.showorders)


router.post('/register',userControllers.registration)
router.post('/login',userControllers.login)
router.post('/otp',userControllers.otpVerification)
router.post('/forget',userControllers.forgetPassword)
router.post('/password_change',upload.none(),userControllers.changePassword)
router.post('/address',authMiddleware,addressControllers.insertAddress)
router.post('/heafer',authMiddleware,userControllers.finduser)
router.post('/order',authMiddleware,orderControllers.placeorder)
router.post('/editProfile',authMiddleware,addressControllers.editProfile)
router.post('/getProfile',authMiddleware,addressControllers.getProfile)
router.post('/cancelorder',authMiddleware,orderControllers.cancelorder)
router.post('/changeEmail',authMiddleware,userControllers.changeEmail)
router.post('/lookisblocked',authMiddleware,userControllers.lookisblocked)
router.post('/bookedDates',authMiddleware,productControllers.bookedDates)

router.post('/emailOtpVerification',authMiddleware,userControllers.emailOtpVerification)
router.post('/checkWalletBalancecheckWalletBalance',authMiddleware,orderControllers.checkWalletBalance)

router.post('/details',authMiddleware,productControllers.Outfitdetails)
router.post('/cart',authMiddleware,cartControllers.addtoCart)
router.post('/getcart',authMiddleware,cartControllers.getCart)
router.post('/get-user-info-by-id',authMiddleware,userControllers.getUsertoken)


router.post("/chats",authMiddleware,chatController.getAllmessage)
router.post("/submitmsg",authMiddleware,chatController.submitMessage)


    
module.exports = router
