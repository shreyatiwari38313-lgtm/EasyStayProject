import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
   name:{ type: String, required: true},
   email:{type: String, unique : true, required: true},
   password : { type: String, required: true },
   phone: String,

   role:{ type: String, enum: ["guest","host","admin"], default : "guest"},
   profileImage: String,  //cloudinary
   createdAt: { type: Date, default: Date.now }
},{timestamps: true})

//hooks 
userSchema.pre("save", async function(){
   if(!this.isModified("password")) return; 
   this.password = await bcrypt.hash(this.password,10)
   
})

//custom methods
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password);
}

//jwt tokens - accesstoken
userSchema.methods.generateAccessToken = function() {
   return jwt.sign(
      {
         _id: this.id,
         name: this.name,
         email: this.email,
         role: this.role
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}

//jwt token - refresh token(has less info)
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
         _id: this.id,

      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}

export default mongoose.model("User", userSchema);