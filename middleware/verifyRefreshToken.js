const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
module.exports = {
verifyRefreshToken: (refreshToken)=>{
    return new Promise((resolve,reject)=>{
        JWT.verify(refreshToken,process.env.REFRESH_TOKEN_KEY,(err,payload)=>{
            if(err){
             console.log(err);   
            return reject(createHttpError.Unauthorized());
            }
            const userId = payload.user;
            resolve(userId);
        })
    })
}
}