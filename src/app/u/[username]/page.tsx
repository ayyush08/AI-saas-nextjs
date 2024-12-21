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

const initialSuggestions = 'What is your favorite color? || What is your favorite food? || What is your favorite movie?'

const page = () => {
  const [isLoading,setIsLoading] = useState(false)
  const {toast} = useToast()
  const {
    complete,
    completion,
    isLoading: isSuggestionLoading,
    error
  } = useCompletion({
    api:'/api/suggest-messages',
    initialCompletion: initialSuggestions
  })
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
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
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
    </div>
  )
}

export default page