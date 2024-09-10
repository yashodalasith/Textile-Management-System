const User = require("../Model/UserManagmentModel");
const bycript = require("bcrypt");
const { error, log } = require("console");
const jwt = require("jsonwebtoken");
const { config } = require("process");
const JWT_SECRET = process.env.JWT_SECRET; // to generate token



const addUser = async (req,res,next) => {
    const{name,email,phone,address,password,ConfirmPassword} = req.body;

    //check password
    if(password!= ConfirmPassword){
        return res.status(400).json({error:"Password do not match"});
    }
    const encryptedPassword = await bycript.hash(password,10);

    const oldUser = await User.findOne({email});
    if(oldUser){
        return res.status(400).json({error:"User already exist"});
    }
    let user;
    try {
        user = new User({
            name,
            email,
            phone,
            address,
            password:encryptedPassword,
            ConfirmPassword,
        });
        await user.save();

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Unable to add user"});
        
    }

    return res.status(200).json({user});

}

const getAllUser=async(req,res,next)=>{

    let users;
    //get all users
    try {
        users = await User.find();
    } catch (error) {
        console.log(err); 
    }
    //not found
    if(!users){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json({users});

}

const getById = async(req,res,next)=>{
    const id = req.params.id;

    let user;
    try {
        user = await User.findById(id);
    } catch (error) {
        console.log(error);
    }
    if(!user){
        return res.status(404).json({message:"user not found!"});
    }
    return res.status(200).json({user});
}

const deleteUser = async (req,res,next) => {
    const id = req.params.id;
    let user;

    try {
        user = await User.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
        
    }
    if(!user){
        return res.status(404).json({message:"unable to delete user!"});
    }
    return res.status(200).json({user});
}

const updateUser = async (req,res,next) => {
    const id = req.params.id;
    const {name,email,phone,address,password,ConfirmPassword} = req.body;
    let users;

    try {
        users =await User.findByIdAndUpdate(id,{
            name:name,
            email:email,
            address:address,
            phone:phone,
            password:password,
            ConfirmPassword:ConfirmPassword,
        });
            users = await users.save();
    } catch (error) {
        console.log(error);
        
    }
    if (!users) {
        return res.status(404).json({ message: "Unable to Update users Details" });
      }
      return res.status(200).json({ users });
};


exports.getAllUser= getAllUser;
exports.addUser = addUser;
exports.deleteUser = deleteUser;
exports.getById = getById;
exports.updateUser = updateUser;
