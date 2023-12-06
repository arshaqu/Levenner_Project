const express = require('express');
const router = express.Router();
const User = require('../Models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring');


let otp;
let userMail


const registration = async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res.status(200).send({ message: "User is Already Exists ", success: false })
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword;
        const newuser = new User(req.body)
        await newuser.save();
        if (newuser) {
            const randomNumber = Math.floor(Math.random() * 9000) + 1000;
            otp = randomNumber;
            userMail = req.body.email
            sentVerifyMail(req.body.name, req.body.email, randomNumber);
        }

        res.status(200).send({ message: "user Created Successfully", success: true });
    } catch (error) {
        console.log(error);
        res
            .send(500)
            .send({ message: "Error while creating the user", success: false, error })
    }
}


const login = async (req, res) => {
    const isVerified = User.isVerified;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
            .status(200)
            .send({ message: "User does not Exist", success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res
            .status(200)
            .send({ message: "You Entered Password is incorrect", success: false })
        }
        else {
            if (user.isVerified == true ) {
                if(user.blocked === false){
                    

                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: "1d"
                    })
                    res.status(200)
                    .send(({ message: "Login Successful", success: true, data: token }))
                }else{
                    res.status(200)
                    
                    .send({message:"User Blocked ",success:false})
                }
                    }
            else {
                res.status(400)
                    .send({ message: "User Email is Not Verified...", success: false })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({ message: "Error logging in ", success: false, error })

    }
}



const sentVerifyMail = async (name, email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized: false
            },
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }

        })
        const mailOption = {
            from: process.env.EMAIL,
            to: email,
            subject: "To verify your mail",
            html: `<p> HI ${name} This is the OTP ${otp} to verify your Levenner Account </p>`
        }

        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(info.response, "response ")
                console.log("email has been send", info.response);
                console.log(otp);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}



const otpVerification = async (req, res) => {
    const postotp = req.body.otp
    console.log(otp);
    try {
        if (otp == undefined) {
            res.status(200)
                .send({ message: "You Have Entered Incorrect OTP", success: false })
        }
        else {

            if (otp == postotp) {
                const verify = await User.findOneAndUpdate(
                    { email: req.body.email },
                    { $set: { isVerified: true } }
                );
                res.status(200)
                    .send({ message: "Your Email is Verified ", success: true })
            }
            else {
                res.status(200)
                    .send({ message: 'Enter the Correct OTP', success: false })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500)
            .send({ message: error, success: false })
    }
}
let token_to_verify;

    const sentResetpasswordMail = async (email, token) => {
        try {
                const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                },
                requireTLS: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
    
            })
            const mailOption = {
                from: process.env.EMAIL,
                to: email,
                subject: "To Reset your password",
                html: `<p> HI,
                 <a href= "http://localhost:3000/password_change?token=${token}" > Please Click this Link <a/> to Reset your Levenner Account Password </p>`,
            }
    
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(info.response, "response ")
                    console.log("email has been send", info.response);
                }
            })
    
        } catch (error) {
            console.log(error.message);
        }
    }


    
    const forgetPassword = async(req,res,next)=>{
        try {

            const email = req.body.email
            const userExist = await User.findOne({email:email})

            if(userExist){
                const token = randomstring.generate()
                await User.updateOne({email:email},{$set:{token:token}})
                sentResetpasswordMail(email,token)
                res.status(200)
                .send({ message : "Please check your Email" ,success:true})
            }
            else{
                res.status(404)
                .send({ message : "Entered Email is Incorrect or not Registered"})
            }

        } catch (error) {
            next(error)
            console.log(error.message);
        }
    }


    const changePassword = async (req,res)=>{
        try {
            const token = req.body.queryValue;
            const password = req.body.values;
            const password2 = req.body.values2;
            console.log(token,password)
            const userData = await User.findOne({token:token})
            if(req.body.password1 !== req.body.password){
                res.status(404)
                .send({ message: "You Entered Password is not Match"})
            }
            if(userData){
                const salt = await bcrypt.genSalt(10)
                const saltpassword = await bcrypt.hash(password2 ,salt)
                const updatePassword = await User.findOneAndUpdate({token:token},{$set:{password: saltpassword, isVerified:true}})
                if(updatePassword){
                    res.status(200)
                    .send({ message: "Password Changed Succefully",success:true})
                }else{
                    res.status(404)
                    .send({message:"Something went wrong",success:false})
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }


            const lookisblocked = async(req,res)=>{
             try {
                console.log(req.body,'iuoiu');
                const user = await User.findOne({ _id:req.body.userId})
                console.log(user.blocked);
                if(user.blocked){
                     res.status(200)
                    .send({message:"user is blocked" ,success:false ,blocked:true})
                }
                else{
                     res.status(200)
                    .send({message:"user is not blocked",blocked:false})
                }
             } catch (error) {
                console.log(error);
             }
            }



        const userList = async (req,res)=>{
            try {
                const user = await User.find()
                res.send(user)
            } catch (error) {
                console.log(error);
            }
        }

        

        const getUsertoken = async(req,res)=>{
            try {
                const user = await User.findOne({ _id: req.body.userId });
                if(!user){
                    return res.status(200)
                    .send({ message:'user does not Exist' ,success:false})
                }
                
                else{
                    res.status(200)
                    .send({success:true,data:{
                        name : user.name,
                        email: user.email
                    }})
                }
            } catch (error) {
               res.status(500)
               .send({message:'Error getting user Info',success:false,error})
            }
        }
   


       const finduser = async (req,res)=>{
        try {
            console.log("Hiih");
        } catch (error) {
            
        }
       }
         
          

       const changeEmail = async(req,res)=>{
        console.log("Heree1",req.body);
        try {
            const email = req.body.value.email
            const userData = await User.findOne({_id:req.body.userId})
            const name = (userData.name)
            const randomNumber = Math.floor(Math.random() * 9000) + 1000;
            const otp = randomNumber;
            console.log(randomNumber);
            changeEmailOtp(name,email,randomNumber)
            await User.updateOne({_id:req.body.userId},{$set:{otp:randomNumber}})
            res.status(200)
            .send({ message : "Please check your Email" ,success:true})
        } catch (error) {
            console.log(error);
        }
       }
          

       const changeEmailOtp = async (name, email, randomNumber) => {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                tls: {
                    rejectUnauthorized: false
                },
                requireTLS: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
    
            })
            const mailOption = {
                from: process.env.EMAIL,
                to: email,
                subject: "To verify your mail",
                html: `<p> HI ${name} This is the OTP ${randomNumber} to Change the Email of your Levenner Account </p>`
            }
    
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(info.response, "response ")
                    console.log("email has been send", info.response);
                    console.log(randomNumber);
                }
            })
    
        } catch (error) {
            console.log(error.message);
        }
    }

          
          
    const emailOtpVerification = async (req, res) => {
        const userOtp = req.body.values.otp
        const newemail = req.body.value.value
        console.log(req.body.value.value);
        console.log(userOtp);
        try {
          const userData = await User.findOne({_id:req.body.userId})
          realOtp = userData.otp
          console.log(realOtp);
                if(userOtp === realOtp){
                    const updateEmail = await User.findOneAndUpdate({_id:req.body.userId},{$set:{email:newemail}})
                    res.status(200)
                    .send({message:"Email updated successfully",success:true})
                }
                else{
                    res.status(400)
                    .send({message:'Email updation Failed' ,success:false})
                }
        } catch (error) {
            console.log(error);
            res.status(500)
                .send({ message: error, success: false })
        }
    }



module.exports = {
    registration,
    login,
    otpVerification,
    forgetPassword,
    changePassword,
    userList,
    getUsertoken,
    finduser,
    changeEmail,
    emailOtpVerification,
    lookisblocked
}