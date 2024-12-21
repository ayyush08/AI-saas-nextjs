import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User.model";
import { Message } from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function POST(request:Request){
    await dbConnect();
    const {username,content} = await request.json()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User //assertion
    if(session?.user.username === username){
        
        return Response.json({
            success:false,
            message:"You can't send message to yourself"
        },{
            status:401
        })
    }
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:404
            })
        }
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{
                status:400
            })
        }
        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message) //assertion as Message
        await user.save()
        return Response.json({
            success:true,
            message:"Message sent successfully"
        },{
            status:200
        })
    } catch (error) {
        console.log("Error sending message",error);
        
        return Response.json({
            success:false,
            message:error || "Error sending message"
        },{
            status:500
        })
    }
}


