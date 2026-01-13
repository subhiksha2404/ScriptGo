'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
            {/* Aesthetic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-navy/[0.02] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange/[0.02] rounded-full blur-[120px]" />

            <div className="container mx-auto px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="flex flex-col items-start text-left">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-border shadow-soft mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Image src="/assets/logo.png" alt="Logo" width={20} height={20} className="h-5 w-auto object-contain" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy">GPT-4o Creative Agent v2.0</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-[-0.04em] text-navy uppercase leading-[0.9] mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                            Content <span className="text-orange">Refined</span> <br /> Into Growth.
                        </h1>

                        <p className="max-w-xl text-xl text-muted-foreground font-medium mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed">
                            ScriptGo transforms abstract ideas into high-performance viral scripts. Engineered for professional creators on YouTube, LinkedIn, and TikTok.
                        </p>

                        <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                            <Link href="/login">
                                <Button className="h-16 px-10 rounded-2xl bg-navy hover:bg-navy/90 text-white text-xs font-black uppercase tracking-widest shadow-premium group transition-all hover:scale-105 active:scale-95">
                                    Start Creating
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 border-border text-xs font-black uppercase tracking-widest hover:bg-soft transition-all">
                                View Workflow
                            </Button>
                        </div>

                        {/* Stats/Metrics */}
                        <div className="mt-16 flex gap-12 border-t border-border pt-12 animate-in fade-in duration-1000 delay-500">
                            <div>
                                <div className="text-3xl font-black text-navy uppercase tracking-tighter">1.2M+</div>
                                <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Scripts Generated</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-navy uppercase tracking-tighter">48ms</div>
                                <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Avg Latency</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Illustration */}
                    <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
                        <div className="relative z-10 w-full aspect-square rounded-[4rem] overflow-hidden shadow-premium border-4 border-white transform hover:rotate-2 transition-transform duration-700">
                            <Image
                                src="/assets/hero-illustration.png"
                                alt="Content Agent Illustration"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative floating elements */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange/10 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-navy/5 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>
            </div>

            {/* Mesh Gradient Background Texture */}
            <div className="absolute inset-0 bg-mesh opacity-[0.03] pointer-events-none" />
        </section>
    )
}
