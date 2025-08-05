import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import User from "./Users.js";

let RoleLevels = {
  user: 1,
  admin: 2,
  superadmin: 3
};

const GenerateToken = (user)=>{
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        }, process.env.KEY, { expiresIn: "1h" })

}

export const Register = async (req, res) => {
    const { name, email, password, refer } = req.body;
    if(!email||!password||!name){
        return res.status(400).json({message:"Bad request: missing parameters!"})
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = name.split(" ")[0] + Date.now();
        const newUser = await User.create({name, email, password: hashedPassword,username:username });
        if (!newUser) {
            return res.status(500).json({ message: "Failed to create user" });
        }
        if(refer && refer !== username){
        const inviter = await User.findOne({username : refer})
        if(inviter){

            inviter.credit+=10
            await inviter.save()
            newUser.credit+=10
            await newUser.save()

        }
        }

        res.status(201).json({ 
            token: GenerateToken(newUser),
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name,
                username: newUser.username,
                credit: newUser.credit,
                Amount: newUser.Amount
            }
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;
    if(!email||!password){
        return res.status(400).json({message:"Bad request: missing parameters!"})
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            token: GenerateToken(user),
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const Change_Role = async (req,res)=>{
   const {email,newRole} = req.body;
   if(!email || !newRole){
       return res.status(400).json({message:"Bad request : missing parameters"})
   }
   if (!ROLE_LEVELS.hasOwnProperty(newRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }
   try {
    const requester = req.user;
    const requesterLevel = RoleLevels[requester.role];

    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const targetLevel = RoleLevels[targetUser.role];
    const newRoleLevel = RoleLevels[newRole];

    if (targetLevel > requesterLevel) {
      return res.status(403).json({ message: "Cannot modify users above your hierarchy" });
    }

    if (newRoleLevel > requesterLevel) {
      return res.status(403).json({ message: "Cannot assign role higher than your own" });
    }

   

    targetUser.role = newRole;
    await targetUser.save();

    res.status(200).json({ message: `Role changed to ${newRole} for ${email}` });

  } catch (err) {
    console.error("Change role error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const AllUsers = async (req, res) => {
    try {
        let users = await User.find({role:"user"}).select('-password');
        users = users.filter(a=>a.role==='user')
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



