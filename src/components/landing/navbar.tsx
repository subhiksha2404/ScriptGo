'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import { cn } from '@/utils/cn'

export function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [supabase.auth])

    return (
        <nav className={cn(
            "fixed top-0 z-50 w-full transition-all duration-300 border-b",
            scrolled ? "bg-white/80 backdrop-blur-md border-border py-4" : "bg-transparent border-transparent py-6"
        )}>
            <div className="container mx-auto flex items-center justify-between px-8">
                <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-border shadow-soft flex items-center justify-center p-2.5 relative overflow-hidden">
                        <Image src="/assets/logo.png" alt="ScriptGo Logo" fill className="object-contain p-2.5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-navy uppercase leading-none">ScriptGo</span>
                        <span className="text-[8px] font-black tracking-[0.3em] text-orange uppercase mt-1">Creative Agent</span>
                    </div>
                </Link>

                <div className="hidden items-center gap-10 lg:flex">
                    <Link href="#features" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-navy transition-all">Research</Link>
                    <Link href="#pricing" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-navy transition-all">Capability</Link>
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-navy transition-all">Access</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link href="/dashboard">
                            <Button className="h-12 px-8 rounded-xl bg-navy hover:bg-navy/90 text-white text-[10px] font-black uppercase tracking-widest shadow-premium active:scale-[0.98] transition-all">
                                Studio Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login?view=signup">
                            <Button className="h-12 px-8 rounded-xl bg-navy hover:bg-navy/90 text-white text-[10px] font-black uppercase tracking-widest shadow-premium active:scale-[0.98] transition-all group">
                                Initialize Account
                                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
