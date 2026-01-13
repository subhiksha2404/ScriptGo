import { Sparkles, Twitter, Github, Linkedin, ShieldCheck, Globe, Zap } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-border bg-white py-24">
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center p-2.5 shadow-soft group-hover:scale-105 transition-transform">
                                <img src="/assets/logo.png" alt="ScriptGo Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter text-navy uppercase leading-none">ScriptGo</span>
                                <span className="text-[8px] font-black tracking-[0.3em] text-orange uppercase mt-1">Creative Agent</span>
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">
                            Premium AI script generation for professional creators. Redefining digital growth through precision content.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy mb-10">Platform</h4>
                        <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            <li><Link href="#features" className="hover:text-orange transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-orange transition-colors">Pricing</Link></li>
                            <li><Link href="/login" className="hover:text-orange transition-colors">Access</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy mb-10">Legal</h4>
                        <ul className="space-y-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            <li><Link href="#" className="hover:text-orange transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-orange transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-orange transition-colors">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-navy mb-10">Broadcast</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-xl bg-soft flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all shadow-soft overflow-hidden">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-xl bg-soft flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all shadow-soft overflow-hidden">
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-xl bg-soft flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all shadow-soft overflow-hidden">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-orange" />
                        <p>© 2026 ScriptGo Studio. Engineered by Antigravity.</p>
                    </div>
                    <div className="flex gap-10">
                        <Link href="#" className="hover:text-navy transition-colors">Studio Status</Link>
                        <Link href="#" className="hover:text-navy transition-colors">Support Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
