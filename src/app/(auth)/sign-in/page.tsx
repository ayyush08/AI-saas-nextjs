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
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { title } from "process"

const page = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debouncedUsername = useDebounceValue(username, 300)

    const {toast} = useToast()
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
            if (debouncedUsername) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get(`/api/check-username-unique/?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                }
                finally{
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [debouncedUsername])

    const onSubmit = async(data:z.infer<typeof signUpSchema>)=>{
        console.log(data);
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up',data)
            console.log(response);
            toast({
                title:"Success",
                description:response.data.message,
            })
            router.replace(`/verify/${username}`)
            
        } catch (error) {
            console.error("Error signing up user",error);
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message ?? "Error signing up user",
                variant:"destructive"
            })
        }
        finally{
            setIsSubmitting(false)
        }
    }

    return (
        <div>page</div>
    )
}

export default page