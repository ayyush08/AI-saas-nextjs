import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";

type messageId = {
    messageId: string
}
export async function DELETE(request: Request, { params }: { params: messageId }) {
    const messageId = params.messageId
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User //assertion
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "You are not authenticated"
        }, {
            status: 401
        })
    }
    try {
        const updatedResult = await UserModel.updateOne(
            {
                _id: user._id,
            },
            {
                $pull: {
                    messages: {
                        _id: messageId
                    }
                }
            }
        )
        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting msg", error)
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, {
            status: 500
        })
    }
}