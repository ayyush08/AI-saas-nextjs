import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod"; 
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    //localhost:3000/api/check-username-unique?username=abc  
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }//zod syntax
        // validating with zod
        const queryResult = UsernameQuerySchema.safeParse(queryParam)
        console.log(queryResult)// remove later
        if(!queryResult.success){
            const usernameErrors = queryResult.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameErrors.length > 0 
                ? usernameErrors.join(', ')
                : "Invalid username"
            },{
                status:400
            })
        }
        const {username} = queryResult.data
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{
                status:400
            })
        }
        return Response.json({
            success:true,
            message:"Username is available"
        },{
            status:200
        })
    } catch (error) {
        console.error("Error checking username uniqueness", error);
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        },
    {
        status: 500
    })
    }
}