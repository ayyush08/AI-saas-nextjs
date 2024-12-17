import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod"; 
import { usernameValidation } from "@/schemas/signUpSchema";


export async function POST(request:Request){
    await dbConnect();
    try {
        const {username,code} = await request.json()
        const decodedUsername = decodeURIComponent(username) // Gets unencoded versions of encoded ones from the URL
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,  
                message:"User not found"
            },
        {
            status:404
        })
        }
        const isCodeValid = user.verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json({
                success:true,
                message:"Account verification successful"
            
        },{
            status:200
        })
    }
    else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"Verification code has expired, please signup again to get a new code"
        },{
            status:400
        })
    }else{
        return Response.json({
            success:false,
            message:"Incorrect verification code"
        },{
            status:400
        })
    }
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
    {
        status: 500
    })
    }
}