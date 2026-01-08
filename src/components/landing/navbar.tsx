'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase.auth])

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="rounded-lg bg-primary p-1">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ScriptGo</span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link href="/dashboard">
                            <Button variant="default" className="font-bold">Dashboard</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
                            <Link href="/login?view=signup">
                                <Button className="font-bold">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
