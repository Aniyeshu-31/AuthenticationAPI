const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader) return next(createHttpError.Unauthorized());

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY,(err,payload)=>{
    if(err){    
        console.log(err);
        const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return next(createHttpError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  })
}

