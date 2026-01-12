import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus, Calendar, AlertCircle, Database } from 'lucide-react'
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

    const { data: rawScripts, error: fetchError } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false })

    if (fetchError) {
        console.error('Error fetching scripts:', fetchError)
    }

    // Process scripts to ensure content is parsed if it's a string
    const scripts = rawScripts?.map(script => {
        let processedContent = script.content;
        if (typeof script.content === 'string') {
            try {
                processedContent = JSON.parse(script.content);
            } catch (e) {
                console.error('Failed to parse content for script:', script.id, e);
            }
        }
        return { ...script, content: processedContent };
    }) || [];

    // Diagnostic: Check if any expected columns are missing in the data
    const expectedColumns = ['calendarDays', 'framework', 'language', 'platform', 'topic', 'tone', 'length'];
    const missingColumns: string[] = [];
    if (rawScripts && rawScripts.length > 0) {
        const firstScript = rawScripts[0];
        expectedColumns.forEach(col => {
            if (!(col in firstScript)) {
                missingColumns.push(col);
            }
        });
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-black">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-white">ScriptGo</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <form action={signOut}>
                            <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container flex-1 py-8 px-4">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                        <p className="text-muted-foreground">Manage and view your AI-generated scripts.</p>
                    </div>
                    <Link href="/editor">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            New Script
                        </Button>
                    </Link>
                </div>

                {/* Database Schema Warning */}
                {missingColumns.length > 0 && (
                    <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Database className="h-5 w-5" />
                            <p className="text-sm font-bold">Database Schema Out of Date</p>
                        </div>
                        <p className="text-xs ml-8">
                            The following columns are missing from your `scripts` table: <code className="bg-amber-500/10 px-1 rounded">{missingColumns.join(', ')}</code>.
                            Saving will fail until these are added to Supabase.
                        </p>
                    </div>
                )}

                {fetchError && (
                    <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">Failed to load scripts: {fetchError.message}</p>
                    </div>
                )}

                {scripts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {scripts.map((script: any) => {
                            const isCalendar = script.calendarDays > 0 || (Array.isArray(script.content) && script.content.length > 0 && 'day' in script.content[0]);

                            return (
                                <Card key={script.id} className="group transition-all border-white/10 bg-white/5 hover:bg-white/10">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                                        {script.platform || 'General'}
                                                    </div>
                                                    {isCalendar ? (
                                                        <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                                            <Calendar className="h-3 w-3" />
                                                            {script.calendarDays || (Array.isArray(script.content) ? script.content.length : 0)} Days
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
                                        <CardTitle className="mt-3 line-clamp-1 text-lg text-white">{script.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs text-muted-foreground">
                                            {script.topic}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-3 text-sm text-muted-foreground/80 leading-relaxed">
                                            {isCalendar
                                                ? `Day 1: ${script.content?.[0]?.title || 'Content Plan'}`
                                                : Array.isArray(script.content) && script.content.length > 0
                                                    ? script.content[0]?.audio
                                                    : typeof script.content === 'string'
                                                        ? script.content
                                                        : 'No content'
                                            }
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-white/10 hover:bg-white/10" asChild>
                                            <Link href={`/editor?id=${script.id}`}>View Script</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : !fetchError && (
                    <div className="flex h-[450px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-12 text-center bg-white/5 group">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                            <div className="relative rounded-full bg-primary/5 p-5 border border-primary/10">
                                <FileText className="h-10 w-10 text-primary/60" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight mb-3 text-white">No scripts yet</h3>
                        <p className="max-w-xs mx-auto text-sm text-muted-foreground leading-relaxed mb-8">
                            Your generated AI scripts will appear here. Start by creating a new script.
                        </p>
                        <Link href="/editor">
                            <Button size="lg" className="h-12 px-8 font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
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
