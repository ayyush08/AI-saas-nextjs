import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Inkognito - Unleash Your Thoughts',
    description: 'Send anonymous messages and express yourself freely',
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" >
            <AuthProvider>
                <body className={inter.className}>
                    {children}
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
