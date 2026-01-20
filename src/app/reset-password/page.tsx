'use client'

import { updatePassword } from '../login/actions'
import { useFormStatus } from 'react-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            formAction={updatePassword}
            className="w-full h-14 rounded-2xl bg-navy hover:bg-navy/90 text-white font-black uppercase tracking-widest shadow-premium active:scale-[0.98] transition-all"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating...
                </>
            ) : (
                'Update Access Key'
            )}
        </Button>
    )
}

export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams: { message: string, code?: string }
}) {
    const [isVerifying, setIsVerifying] = useState(true)
    const [authError, setAuthError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        async function verifySession() {
            const code = searchParams.code
            if (code) {
                // If there's a code in the URL, exchange it for a session
                const { error } = await supabase.auth.exchangeCodeForSession(code)
                if (error) {
                    setAuthError(error.message)
                }
            } else {
                // If no code, check if we already have a session
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                    setAuthError("Auth session missing. Please request a new reset link.")
                }
            }
            setIsVerifying(false)
        }
        verifySession()
    }, [searchParams, supabase.auth])

    if (isVerifying) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-soft">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-navy" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Verifying Security Session...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-soft px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-navy/[0.03] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange/[0.03] rounded-full blur-[120px]" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10 space-y-3">
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-border shadow-soft">
                            <Image src="/assets/logo.png" alt="Logo" width={24} height={24} className="h-6 w-auto object-contain" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy">ScriptGo Security</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">
                        New Access Key
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Set your new professional studio password
                    </p>
                </div>

                <div className="premium-card p-10 bg-white shadow-premium relative">
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white shadow-premium">
                        <ShieldCheck className="h-6 w-6" />
                    </div>

                    {authError ? (
                        <div className="space-y-6 text-center">
                            <div className="flex justify-center">
                                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-sm font-bold text-destructive">{authError}</p>
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl border-border"
                                onClick={() => window.location.href = '/forgot-password'}
                            >
                                Request New Link
                            </Button>
                        </div>
                    ) : (
                        <form className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="password" title="Enter your new secure password" className="text-[10px] font-black uppercase tracking-widest text-navy ml-1">New Access Key</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-14 rounded-xl border-2 border-border focus:border-navy transition-all px-5 font-bold text-navy text-2xl"
                                />
                            </div>

                            {(searchParams?.message || authError) && (
                                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-[11px] font-bold uppercase tracking-tight text-center">
                                    {searchParams.message || authError}
                                </div>
                            )}

                            <div className="pt-2">
                                <SubmitButton />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
