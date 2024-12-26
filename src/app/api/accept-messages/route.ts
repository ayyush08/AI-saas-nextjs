import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User //assertion
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You are not authenticated"
        },{
            status:401
        })
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessages
        },{
            new:true
        })
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:401
            })
        }
        console.log("accepting msg",updatedUser.isAcceptingMessage);
        
        return Response.json({
            success:true,
            message: updatedUser.isAcceptingMessage ?"User status updated to accept messages successfully" : "User status updated to not accept messages successfully",
            updatedUser
        },{
            status:200
        })
    } catch (error) {
        console.log("Error in updating user status to accept messages",error);
        
        return Response.json({
            success:false,
            message:"Failed to update user status to accept messages"
        },{
            status:500
        })
    }
}

export async function GET(){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User //assertion
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You are not authenticated"
        },{
            status:401
        })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:404
            })
        }
        return Response.json({
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessage,
            user:foundUser
        },{
            status:200
        })
    } catch (error) {
        console.log("Error in getting user status to accept messages",error);
        return Response.json({
            success:false,
            message:"Failed to get user status to accept messages"
        },{
            status:500
        })
        
    }
}

