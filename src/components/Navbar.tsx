'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
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
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Textarea } from './ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface AskLinkProps {
    url: string
}

const AskLink = () => {
    const { toast } = useToast()
    const form = useForm<AskLinkProps>({
        defaultValues: { url: '' }
    });
    const router = useRouter()
    const onSubmit = (data: AskLinkProps) => {
        try {
            new URL(data.url)
            router.replace(data.url)

        } catch (error) {
            toast({
                title: "Invalid Url",
                variant: 'destructive'
            })
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline'>Send Message</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Send Message</AlertDialogTitle>
                    <AlertDialogDescription>
                        Enter the receiver's public profile url to send them an anonymous message
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Paste public profile url"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction type="submit">Go to Url</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>

    )
}

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User //assertion
    console.log(window.location);

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="/" className='text-3xl font-bold mb-4 md:mb-0'>Mystery Message</a>
                {
                    session ? (<>
                        <span className=' mx-auto font-bold px-4 text-xl'>Welcome, {user.username || user.email}</span>
                        <div className='flex flex-col md:flex-row gap-4'>
                            {window.location.pathname !== '/dashboard' &&
                                <Link href='/dashboard'>
                                    <Button variant='outline' className='w-full md:w-auto'>Dashboard</Button>
                                </Link>}
                            <AskLink />

                            <Button className='w-full md:w-auto' onClick={() => signOut()} >Logout</Button>
                        </div>
                    </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className='w-full md:w-auto'>Login</Button>
                        </Link>

                    )
                }
            </div>
        </nav>
    )
}

export default Navbar