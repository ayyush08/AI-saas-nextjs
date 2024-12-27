'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from '@/models/User.model'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' 
type MessageCardProps = {
    message: Message
    onMessageDelete: (messageId:string) => void
}
dayjs.extend(relativeTime)


const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const {toast} = useToast()
    

    const handleDeleteMessage = async ()=>{
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title:response.data.message,
            })
            onMessageDelete(message._id as string) //check back
        } catch (error) {
            toast({
                title:"Error deleting message",
                variant:'destructive'
            })
            
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-center'>

                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>WARNING !</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the message from your account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteMessage} className='bg-red-500 ' >Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
                <CardDescription>{dayjs(message.createdAt).fromNow()}</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>

    )
}

export default MessageCard