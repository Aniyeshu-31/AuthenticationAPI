const mongoose = require('mongoose');

const mongoConnect = async()=>{
   await mongoose.connect(process.env.MONGO_URI);
   console.log("MongoDB Connected Successfully");
}
mongoose.connection.on('connected',()=>{
    console.log("Mongoose Connected to DB");
})
mongoose.connection.on('error',(err)=>{
    console.log(err.message);
})
mongoose.connection.on('disconnected',()=>{
    console.log("Mongoose Disconnected");
})
process.on('SIGINT', async()=>{
    await mongoose.connection.close();
    process.exit(0);
})
module.exports = mongoConnect;