'use client';

import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

export default function AppBar() {
    return (
        <header className="flex justify-between items-center p-4 gap-4 h-16">
            <div>LOGO</div>
            <div className='flex gap-4'>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    )
}