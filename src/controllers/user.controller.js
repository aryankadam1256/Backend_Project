import asyncHandler from "../utils/asyncHandler.js";
// import User from "../models/user.model.js";
import User from "../models/user.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
// 1) register user
const registerUser=asyncHandler(async(req,res,next)=>{
    // res.status(200).json({
    //     message:"ok"
    // });

//steps:-
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username, email
    // check for images, check for avatar
    // upload them to cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {username,fullname,email,password}=req.body;
console.log("username: ",username);

// step 2
    if([fullname,email,username,password].some((field)=> field?.trim() === "")){
        throw new ApiError(400,"All fields are required");
    }
    // ))
//step 3
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(400,"User with Username or Email already exists");
    }
// step 4
    const avatarLocalPath=req.files?.avatar[0].path;
    const coverImageLocalPath=req.files?.coverImage[0].path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }
// step 5
const avatar=await uploadCloudinary(avatarLocalPath);
const coverImage=await uploadCloudinary(coverImageLocalPath);
if(!avatar){
    throw new ApiError(400,"Avatar is required");
}

// step 6
const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage.url || "",
    email,
    password,
    username:username.toLowerCase()

})
const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500,"User creation failed");
    }

    return res.status(201).json(
        new ApiResponse(200,"User registered successfully,createrUser")
    );
//res.status(201).json(createdUser);
});



// 2) login user
const loginUser=asyncHandler(async(req,res,next)=>{

// step 1:- EXTRACT USER DETAILS
const {username,password,email}=req.body;

// step 2:- CHECK FOR MISSING DETIALS FILLED
// if({username,password,email}.some((field)=> field?.trim() === "")){
//     throw new ApiError(400,"All fields are required");
// }
if(!username || !email){
    throw new ApiError(400,"username or email is required");
}

// step 3:- VALIDATE IF THE DETAILS EXIST IN THE DATABASE OR NOT
const user= User.findOne({
    $or:[{username},{email}]
});

if(user){

}
else{
   throw new ApiError(404,"User not found");
}

// STEP 4 :-  CHECK IF THE PASSWORD IS CORRECT

 const isPasswordValid=await user.isPasswordCorrect(password);        

 if(!isPasswordValid){
   throw await ApiError(401,"Password is incorrect");
 }
// STEP 5 :- CREATE JWT TOKEN AND SEND IT BACK TO THE USER



});

export {registerUser};