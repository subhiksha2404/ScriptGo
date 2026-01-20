'use client'

import { login, signup } from './actions'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

function SubmitButton({ view }: { view: 'login' | 'signup' }) {
    const { pending } = useFormStatus()

    return (
        <Button
            formAction={view === 'login' ? login : signup}
            className="w-full h-14 rounded-2xl bg-navy hover:bg-navy/90 text-white font-black uppercase tracking-widest shadow-premium active:scale-[0.98] transition-all"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {view === 'login' ? 'Processing...' : 'Initializing...'}
                </>
            ) : (
                <div className="flex items-center gap-2">
                    {view === 'login' ? 'Enter Studio' : 'Create Account'}
                    <ArrowRight className="h-4 w-4" />
                </div>
            )}
        </Button>
    )
}

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    const [view, setView] = useState<'login' | 'signup'>('login')

    return (
        <div className="flex min-h-screen items-center justify-center bg-soft px-4 relative overflow-hidden">
            {/* Aesthetic Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-navy/[0.03] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange/[0.03] rounded-full blur-[120px]" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10 space-y-3">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-border shadow-soft mb-6">
                        <Image src="/assets/logo.png" alt="Logo" width={24} height={24} className="h-6 w-auto object-contain" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-navy">ScriptGo Agent</span>
                    </div>
                    <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">
                        {view === 'login' ? 'Welcome Back' : 'Enter Workspace'}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        {view === 'login'
                            ? 'Secure access to your creative workshop'
                            : 'Initialize your professional creator workspace'}
                    </p>
                </div>

                <div className="premium-card p-10 bg-white shadow-premium relative">
                    {/* Security Badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white shadow-premium">
                        <ShieldCheck className="h-6 w-6" />
                    </div>

                    <form className="space-y-6">
                        {view === 'signup' && (
                            <div className="space-y-3">
                                <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-navy ml-1">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder="e.g. Alexander Visou"
                                    required
                                    className="h-14 rounded-xl border-2 border-border focus:border-navy transition-all px-5 font-bold text-navy"
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-navy ml-1">Studio Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@studio.com"
                                required
                                className="h-14 rounded-xl border-2 border-border focus:border-navy transition-all px-5 font-bold text-navy"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" title="Enter your secure password" className="text-[10px] font-black uppercase tracking-widest text-navy">Access Key</Label>
                                {view === 'login' && (
                                    <a href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-orange hover:underline underline-offset-4">
                                        Forgot?
                                    </a>
                                )}
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-14 rounded-xl border-2 border-border focus:border-navy transition-all px-5 font-bold text-navy text-2xl"
                            />
                        </div>

                        {searchParams?.message && (
                            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-[11px] font-bold uppercase tracking-tight text-center">
                                {searchParams.message}
                            </div>
                        )}

                        <div className="pt-2">
                            <SubmitButton view={view} />
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-border">
                        <button
                            type="button"
                            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                            className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-navy transition-all"
                        >
                            {view === 'login'
                                ? "Don't have access yet? "
                                : 'Already registered? '}
                            <span className="text-orange underline underline-offset-4 decoration-2">
                                {view === 'login' ? 'Create Account' : 'Sign In Now'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="mt-10 flex justify-center gap-8">
                    <div className="flex flex-col items-center gap-1 opacity-20 grayscale">
                        <span className="text-[8px] font-black uppercase tracking-widest text-navy">Powered by</span>
                        <div className="font-black text-xs uppercase tracking-tighter">TensorFlow</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-20 grayscale">
                        <span className="text-[8px] font-black uppercase tracking-widest text-navy">Secured by</span>
                        <div className="font-black text-xs uppercase tracking-tighter">Supabase</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
