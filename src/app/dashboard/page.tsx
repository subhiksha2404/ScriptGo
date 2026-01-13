import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Plus, Calendar, AlertCircle, Database, LayoutDashboard } from 'lucide-react'
import { signOut } from '../login/actions'
import { DeleteButton } from '@/components/dashboard/delete-button'

import Image from 'next/image'

interface ScriptRow {
    visual: string
    audio: string
}

interface CalendarEntry {
    day: number
    title: string
    script: ScriptRow[]
}

interface Script {
    id: string
    user_id: string
    title: string
    content: ScriptRow[] | CalendarEntry[]
    platform: string
    topic: string
    tone: string
    created_at: string
    updated_at: string
    length: string
    language: string
    framework: string
    calendarDays: number
}

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
    const scripts = (rawScripts?.map(script => {
        let processedContent = script.content;
        if (typeof script.content === 'string') {
            try {
                processedContent = JSON.parse(script.content);
            } catch (e) {
                console.error('Failed to parse content for script:', script.id, e);
            }
        }
        return { ...script, content: processedContent };
    }) || []) as Script[];

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
            <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-8">
                    <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
                        <div className="w-10 h-10 rounded-xl bg-white border border-border shadow-soft flex items-center justify-center p-2 relative overflow-hidden">
                            <Image src="/assets/logo.png" alt="Logo" fill className="object-contain p-2" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tighter text-navy uppercase leading-none">ScriptGo</span>
                            <span className="text-[7px] font-black tracking-[0.3em] text-orange uppercase mt-0.5">Creative Agent</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy">Agent Status</span>
                            <span className="text-xs font-semibold text-muted-foreground">{user.email}</span>
                        </div>
                        <form action={signOut}>
                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-soft transition-all">
                                Exit Workspace
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container flex-1 py-8 px-4">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-orange font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                            <LayoutDashboard className="h-3 w-3" />
                            Agent Overview
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tighter">Workspace.</h1>
                    </div>
                    <Link href="/editor">
                        <Button className="h-14 px-8 rounded-2xl bg-navy hover:bg-navy/90 text-white text-xs font-black uppercase tracking-widest shadow-premium transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 h-4 w-4" />
                            Initiate Creation
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
                        {scripts.map((script: Script) => {
                            const isCalendar = script.calendarDays > 0 || (Array.isArray(script.content) && script.content.length > 0 && 'day' in script.content[0]);

                            return (
                                <Card key={script.id} className="group transition-all border-border bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-premium-hover rounded-[2rem] overflow-hidden">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2 rounded-full border border-border bg-white px-2.5 py-1 text-[10px] font-black text-navy uppercase tracking-wider">
                                                        {script.platform || 'General'}
                                                    </div>
                                                    {isCalendar ? (
                                                        <div className="flex items-center gap-1 rounded-full border border-orange/20 bg-orange/10 px-2.5 py-1 text-[10px] font-black text-orange uppercase tracking-wider">
                                                            <Calendar className="h-3 w-3" />
                                                            {script.calendarDays || (Array.isArray(script.content) ? script.content.length : 0)} Days
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 rounded-full border border-border bg-soft px-2.5 py-1 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                                                            {script.length || '60s'}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest ml-1">
                                                    {new Date(script.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <DeleteButton id={script.id} />
                                        </div>
                                        <CardTitle className="mt-4 line-clamp-1 text-xl font-black text-navy uppercase tracking-tighter">{script.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs font-medium text-muted-foreground mt-1">
                                            {script.topic}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-6">
                                        <p className="line-clamp-3 text-sm text-muted-foreground/80 leading-relaxed font-medium">
                                            {isCalendar
                                                ? `Day 1: ${(script.content as CalendarEntry[])?.[0]?.title || 'Content Plan'}`
                                                : Array.isArray(script.content) && script.content.length > 0
                                                    ? (script.content as ScriptRow[])[0]?.audio
                                                    : typeof script.content === 'string'
                                                        ? script.content
                                                        : 'No content'
                                            }
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Button variant="outline" size="sm" className="w-full h-11 text-[10px] font-black uppercase tracking-widest border-border hover:bg-navy hover:text-white rounded-xl transition-all" asChild>
                                            <Link href={`/editor?id=${script.id}`}>Open Script</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : !fetchError && (
                    <div className="flex h-[450px] flex-col items-center justify-center rounded-[3rem] border border-dashed border-border p-12 text-center bg-white/40 backdrop-blur-sm group">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-orange/10 rounded-full blur-2xl group-hover:bg-orange/20 transition-all duration-500" />
                            <div className="relative rounded-[2rem] bg-white p-6 border border-border shadow-soft">
                                <FileText className="h-10 w-10 text-navy/40" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-navy uppercase tracking-tighter mb-4">No content in the workspace.</h3>
                        <p className="max-w-xs mx-auto text-sm text-muted-foreground font-medium mb-10 leading-relaxed">
                            Your creative projects will appear here once you initiate your first professional creation.
                        </p>
                        <Link href="/editor">
                            <Button size="lg" className="h-14 px-10 rounded-2xl bg-navy hover:bg-navy/90 text-white text-xs font-black uppercase tracking-widest shadow-premium transition-all hover:scale-105 active:scale-95">
                                <Plus className="mr-2 h-5 w-5" />
                                Open Workspace
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}
