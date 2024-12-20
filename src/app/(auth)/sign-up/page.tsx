'use client'
// import { useSession, signIn, signOut } from "next-auth/react"

// export default function Component() {
//     const { data: session } = useSession()
//     if (session) {
//         return (
//             <>
//                 Signed in as {session.user.email} <br />
//                 <button onClick={() => signOut()}>Sign out</button>
//             </>
//         )
//     }
//     return (
//         <>
//             Not signed in <br />
//             <button className="bg-orange-500 px-3 py-1 m-4 rounded" onClick={() => signIn()}>Sign in</button>
//         </>
//     )
// }

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import * as  z from "zod" // * for all exports, as for alias 
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
const page = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced= useDebounceCallback(setUsername, 300)

    const { toast } = useToast()
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }

    })
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get(`/api/check-username-unique/?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                }
                finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        console.log(data);
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            console.log(response);
            toast({
                title: "Success",
                description: response.data.message,
            })
            router.replace(`/verify/${username}`)

        } catch (error) {
            console.error("Error signing up user", error);
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? "Error signing up user",
                variant: "destructive"
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xxl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous messaging journey
                    </p>
                </div>
                <Form
                    {...form}
                >
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field}
                                        onChange={(e)=>{
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                        />
                                    </FormControl>
                                    
                                        {isCheckingUsername && <Loader2 className="animate-spin"/>}
                                        <p className={`text-sm ${usernameMessage === "Username is available" ?'text-green-500' :'text-red-500'}`}>
                                            {usernameMessage}
                                        </p>
                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (<>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait..
                            </>) : ("SignUp")}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href='/sign-in' className="text-blue-600 hover:text-blue-800" >
                        Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page