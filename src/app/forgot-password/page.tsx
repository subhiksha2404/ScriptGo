'use client'

import { requestPasswordReset } from '../login/actions'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            formAction={requestPasswordReset}
            className="w-full h-14 rounded-2xl bg-navy hover:bg-navy/90 text-white font-black uppercase tracking-widest shadow-premium active:scale-[0.98] transition-all"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                </>
            ) : (
                'Send Reset Link'
            )}
        </Button>
    )
}

export default function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-soft px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-navy/[0.03] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange/[0.03] rounded-full blur-[120px]" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10 space-y-3">
                    <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-navy transition-all mb-4">
                        <ArrowLeft className="h-3 w-3" />
                        Back to Login
                    </Link>
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-border shadow-soft">
                            <Image src="/assets/logo.png" alt="Logo" width={24} height={24} className="h-6 w-auto object-contain" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy">ScriptGo Recovery</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">
                        Reset Access
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Enter your studio email to recover your access key
                    </p>
                </div>

                <div className="premium-card p-10 bg-white shadow-premium relative">
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white shadow-premium">
                        <ShieldCheck className="h-6 w-6" />
                    </div>

                    <form className="space-y-6">
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

                        {searchParams?.message && (
                            <div className="p-4 rounded-xl bg-navy/5 border border-navy/20 text-navy text-[11px] font-bold uppercase tracking-tight text-center">
                                {searchParams.message}
                            </div>
                        )}

                        <div className="pt-2">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
