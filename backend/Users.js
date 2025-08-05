import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user"
  },
  username:{
    type:String,
    unique:true,
    required:true
  },
  credit:{
    type:Number,
    default:0
  },
  Amount:{
    type:Number,
    default:0
  }
});


const User = mongoose.model("User", userSchema);

export default User;
