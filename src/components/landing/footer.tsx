import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-border/40 py-12 bg-card/10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="rounded-lg bg-primary p-1">
                                <Sparkles className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">ScriptGo</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Empowering creators with AI-driven script generation for social media success.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Product</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/editor" className="hover:text-primary transition-colors">Script Editor</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-muted-foreground">Social</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
                    <p>© 2026 ScriptGo. Powered by Antigravity.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-foreground transition-colors">Status</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
