'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'


const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User //assertion
    console.log(window.location);
    
    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="/" className='text-xl font-bold mb-4 md:mb-0'>Mystery Message</a>
                {
                    session ? (<>
                        <span className=' mx-auto font-bold text-2xl'>Welcome, {user.username || user.email}</span>
                        <div className='flex flex-col md:flex-row gap-4'>
                        {window.location.pathname!=='/dashboard' &&
                            <Link href='/dashboard'>
                            <Button variant='outline' className='w-full md:w-auto'>Dashboard</Button>
                        </Link>}
                        <Link href={`/u/${user.username}`}>
                            <Button variant='outline' className='w-full md:w-auto'>Send Message</Button>
                        </Link>
                        <Button className='w-full md:w-auto' onClick={()=>signOut()} >Logout</Button>
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