'use client'
import { Form,FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCompletion } from 'ai/react'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

const initialSuggestions = 'What is your favorite color? || What is your favorite food? || What is your favorite movie?'

const parseStringMessages = (messages:string):string[]=>{
  console.log(messages);
  
  return messages.split('||')
}

const page = () => {
  const [isLoading,setIsLoading] = useState(false)
  const {toast} = useToast()
  const [messages,setMessages] = useState(initialSuggestions);
  const [isSuggestionLoading,setIsSuggestionLoading] = useState(false)
  const [suggestionError,setSuggestionError] = useState('')
  const params = useParams();
  const username = params.username
  
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })  
  const messageContent = form.watch('content');

  const onSubmit = async(data:z.infer<typeof messageSchema>)=>{
    setIsLoading(true)
    try {
      const response = await axios.post('/api/send-message',{
        ...data,
        username
      })
      
      toast({
        title:response.data.message,
        variant:'default'
      })
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Unable to send message",
        description: axiosError.response?.data?.message || "Failed to send message",
        variant:'destructive'
      })
    }
    finally{
      setIsLoading(false)
    }
  }


  const fetchSuggestedMessages = async()=>{
    try {
      setIsSuggestionLoading(true)
      const messages = await axios.post('/api/suggest-messages')
      setMessages(messages.data.messages)
      toast({
        title:"New messages suggested",
        variant:'default'
      })
      
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>
      setSuggestionError(axiosError.response?.data?.message || 'Something went wrong')
      toast({
        title:"Error suggesting messages",
        description: axiosError.response?.data?.message || "Something went wrong",
        variant:'destructive'
      })
    }finally{
      setIsSuggestionLoading(false)
    }
  }

  const handleMessageClick = (message:string)=>{
    form.setValue('content',  message)
  }

  return (
    <>
    <div className='mx-auto p-5 text-center'>
      <a href="/" className='text-4xl  font-bold mb-4 md:mb-0'>Anonymous Message</a>

    </div>
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Public Profile of @{username}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send Message
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestionLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className={`flex flex-col space-y-4 ${isSuggestionLoading ? 'opacity-20 animate-pulse ' : ''} transition-opacity duration-600`}>
            {suggestionError ? (
              <p className="text-red-500">{suggestionError}</p>
            ) : (
              parseStringMessages(messages).map((message, index) => (
                <Button
                key={index}
                variant="outline"
                className="mb-2"
                data-testid="generation"
                onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
            </>
  )
}

export default page