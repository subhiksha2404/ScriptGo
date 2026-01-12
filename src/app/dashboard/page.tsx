import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus, Calendar } from 'lucide-react'
import { signOut } from '../login/actions'
import { DeleteButton } from '@/components/dashboard/delete-button'

export default async function DashboardPage() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: scripts } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-black">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight">ScriptGo</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <form action={signOut}>
                            <Button variant="ghost" size="sm">
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container flex-1 py-8 px-4">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Manage and view your AI-generated scripts.</p>
                    </div>
                    <Link href="/editor">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Script
                        </Button>
                    </Link>
                </div>

                {scripts && scripts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {scripts.map((script) => {
                            const isCalendar = script.calendarDays > 0 || (Array.isArray(script.content) && script.content.length > 0 && 'day' in script.content[0]);

                            return (
                                <Card key={script.id} className="group transition-all card card-hover">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground uppercase tracking-wider">
                                                        {script.platform}
                                                    </div>
                                                    {isCalendar ? (
                                                        <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                                            <Calendar className="h-3 w-3" />
                                                            {script.calendarDays || script.content.length} Days
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                                            {script.length || '60s'}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-medium ml-0.5">
                                                    {new Date(script.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <DeleteButton id={script.id} />
                                        </div>
                                        <CardTitle className="mt-3 line-clamp-1 text-lg">{script.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs">
                                            {script.topic}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-3 text-sm text-muted-foreground/80 leading-relaxed">
                                            {isCalendar
                                                ? `Day 1: ${script.content[0]?.title || 'Content Plan'}`
                                                : Array.isArray(script.content)
                                                    ? script.content[0]?.audio
                                                    : typeof script.content === 'string' && script.content.startsWith('[')
                                                        ? JSON.parse(script.content)[0]?.audio
                                                        : script.content
                                            }
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" size="sm" className="w-full text-xs font-semibold" asChild>
                                            <Link href={`/editor?id=${script.id}`}>View Script</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-[450px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/20 group">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                            <div className="relative rounded-full bg-primary/5 p-5 border border-primary/10">
                                <FileText className="h-10 w-10 text-primary/60" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight mb-3">No scripts yet</h3>
                        <p className="max-w-xs mx-auto text-sm text-muted-foreground leading-relaxed mb-8">
                            Your generated AI scripts will appear here. Start by creating a new script for YouTube or LinkedIn.
                        </p>
                        <Link href="/editor">
                            <Button size="lg" className="h-12 px-8 font-bold shadow-xl shadow-primary/20">
                                <Plus className="mr-2 h-5 w-5" />
                                Create First Script
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}
