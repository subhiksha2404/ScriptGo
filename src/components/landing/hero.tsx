'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Video, Linkedin, Zap } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Zap className="h-4 w-4" />
                    <span>New: GPT-4o Powered Generation</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-tr from-white via-white to-primary/50 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    Viral Scripts <span className="text-primary italic">Refined</span>.
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    ScriptGo uses advanced AI to craft high-conversion scripts for YouTube and LinkedIn. Stop staring at a blank page and start creating.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Link href="/login">
                        <Button size="lg" className="h-14 px-10 text-lg font-bold btn-primary group rounded-full">
                            Get Started for Free
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-full border-primary/20 hover:bg-primary/5">
                            Play Demo
                        </Button>
                    </Link>
                </div>

                {/* Platform Display */}
                <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 animate-in fade-in duration-1000 delay-500">
                    <div className="flex items-center gap-2">
                        <Video className="h-8 w-8" />
                        <span className="text-2xl font-bold">YouTube</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Linkedin className="h-8 w-8" />
                        <span className="text-2xl font-bold">LinkedIn</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-8 w-8" />
                        <span className="text-2xl font-bold">TIKTOK</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
