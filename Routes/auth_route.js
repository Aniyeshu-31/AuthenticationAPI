const express = require('express');
const createHttpError = require('http-errors');
const Router = express.Router();
const User =  require('../Models/User');
const JWT = require('jsonwebtoken');
const isAuth = require('../middleware/verifyToken')
const authSchema = require('../Utils/validationSchema');
const  {verifyRefreshToken} = require('../middleware/verifyRefreshToken');
Router.post('/register',async(req,res,next)=>{
    try {
      const result = await authSchema.validateAsync(req.body);
      const doesExist = await User.findOne({email:result.email});
      if(doesExist){
        throw createHttpError.Conflict(`${result.email} has already been Registered!`)
      }
    const user = new User(result);
    const expireTime = {
        expiresIn:"24hr"
    }
    const data = 
    {
        user : user._id
    }
    const authToken = await JWT.sign(data, process.env.ACCESS_TOKEN_KEY,expireTime);
    const refreshToken = await JWT.sign(
        data,
        process.env.REFRESH_TOKEN_KEY,
        {expiresIn:'48hr'}
        )
        res.cookie("JWT",authToken,{httpOnly:true,maxAge: maxAge * 1000});
        const savedUser = await user.save();
    res.send({authToken,refreshToken});
    } catch (error) {
        console.log(error);
        if(error.isJoi === true) error.status = 422;
        next(error)
    }
})
Router.post('/login',async(req,res,next)=>{
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({email: result.email});
        if(!user){
            throw createHttpError.NotFound("User not Registered");
        }
        const isMatch = await user.isValidPassword(result.password);
        if(!isMatch)throw createHttpError.Unauthorized('Username/Password is not Valid')
       const payload = {
         user: user._id,
       }
       const expireTime = {
         expiresIn: '24hr',
       }
       const authToken = await JWT.sign(
         payload,
         process.env.ACCESS_TOKEN_KEY,
         expireTime
       )
        res.cookie('JWT', authToken, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        })
       const refreshToken = await JWT.sign(payload,process.env.REFRESH_TOKEN_KEY,{expiresIn:'48hr'});
        res.send({authToken , refreshToken});
    } catch (error) {
        console.log(error);
        if(error.isJoi === true)return next(createHttpError.BadRequest("Invalid Username/Password"))
        next(error);
    }
})
Router.post('/refresh-token',async(req,res,next)=>{
    try {
        const  { refreshToken } = req.body;
        if(!refreshToken)throw createHttpError.BadRequest();
        
       const user = await verifyRefreshToken(refreshToken);
       console.log(user);
       const authToken =   await JWT.sign(
         user,
         process.env.ACCESS_TOKEN_KEY,
       )
       const refToken = await JWT.sign(
         user,
         process.env.REFRESH_TOKEN_KEY,
       )
       res.send({authToken:authToken,refreshToken:refToken});
    } catch (error) {
        next(error); 
    }
})
Router.post('/logout/:id',isAuth,async(req,res,next)=>{
    await User.findByIdAndDelete(id);
    res.cookie("JWT",'',{maxAge:1})
    res.send({message:UsersLoggedOut});
})
module.exports = Router;