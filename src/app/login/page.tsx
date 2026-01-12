'use client'

import { login, signup } from './actions'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

function SubmitButton({ view }: { view: 'login' | 'signup' }) {
    const { pending } = useFormStatus()

    return (
        <Button
            formAction={view === 'login' ? login : signup}
            className="w-full"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {view === 'login' ? 'Signing In...' : 'Signing Up...'}
                </>
            ) : (
                view === 'login' ? 'Sign In' : 'Sign Up'
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
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-md border-border bg-card">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        {view === 'login' ? 'Welcome back' : 'Create an account'}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {view === 'login'
                            ? 'Enter your email to sign in to your account'
                            : 'Enter your details to create a new account'}
                    </CardDescription>
                </CardHeader>
                <form>
                    <CardContent className="space-y-4">
                        {view === 'signup' && (
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder="John Doe"
                                    required
                                    className="bg-background"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-background"
                            />
                        </div>
                        {searchParams?.message && (
                            <p className="text-sm font-medium text-destructive">
                                {searchParams.message}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <SubmitButton view={view} />
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                {view === 'login'
                                    ? "Don't have an account? "
                                    : 'Already have an account? '}
                            </span>
                            <button
                                type="button"
                                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                                className="font-medium text-primary hover:underline"
                            >
                                {view === 'login' ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
