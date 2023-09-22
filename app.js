const express = require('express');
const morgan = require('morgan');
var cors = require('cors')
const httperrors = require('http-errors');
require('dotenv').config();
const authRoute = require('./Routes/auth_route');
const mongoConnect = require('./Utils/db');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
// app.use('/',isAuth,(req,res,next)=>{
//     res.send("Hello From Express");
// })
app.use('/auth',authRoute);

app.use(async(req,res,next)=>{
   next(httperrors.NotFound());
})


app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.send({
        error :{
            status:err.status || 500,
            message: err.message
        }
    })
})
const PORT = process.env.PORT || 3000;
try{
    app.listen(PORT,async()=>{
        await mongoConnect();
        console.log(`Server running on PORT = ${PORT}`);
    })
}
catch(err){
    console.log(err.message);
}