const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const  UserSchema = new Schema({
    name:{
       type:String,
       required:true
    },
    email:{
        type:String,
        required: true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default:new Date()
    },
})

UserSchema.pre('save',async function(next){
     try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;
        next();
     } catch (error) {
        next(error);
     }
})
UserSchema.methods.isValidPassword = async function(password){
    try {
       return await bcrypt.compare(password,this.password)
    } catch (error) {
        throw error;
    }
}
module.exports = mongoose.model('User',UserSchema);