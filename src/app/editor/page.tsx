'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
    Youtube,
    Linkedin,
    Sparkles,
    Copy,
    Save,
    ChevronLeft,
    Loader2,
    Check,
    Video,
    Plus,
    Trash2,
    X,
    CalendarDays
} from 'lucide-react'

import Link from 'next/link'
import { generateScript, saveScript, fetchScript, deleteScript, generateCalendar } from './actions'
import { cn } from '@/utils/cn'

interface ScriptRow {
    visual: string
    audio: string
}

interface CalendarEntry {
    day: number
    title: string
    script: ScriptRow[]
}

const platforms = [
    { id: 'YouTube', icon: Youtube, label: 'YouTube' },
    { id: 'LinkedIn', icon: Linkedin, label: 'LinkedIn' },
    { id: 'TikTok', icon: Video, label: 'TikTok' },
    { id: 'Shorts', icon: Sparkles, label: 'Shorts' },
]

const tones = [
    'Professional',
    'Conversational',
    'Humorous',
    'Educational',
    'Urgent',
    'Inspirational',
]

const languages = [
    'English',
    'Tamil',
    'Hindi',
    'Spanish',
    'French',
    'German',
]

const frameworks = [
    'None',
    'AIDA',
    'PAS',
]

function EditorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const scriptId = searchParams.get('id')

    const [platform, setPlatform] = useState('YouTube')
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState('Professional')
    const [length, setLength] = useState('60s')
    const [language, setLanguage] = useState('English')
    const [framework, setFramework] = useState('None')
    const [calendarDays, setCalendarDays] = useState(0)
    const [content, setContent] = useState<ScriptRow[] | CalendarEntry[]>([])
    const [title, setTitle] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [viewingEntry, setViewingEntry] = useState<CalendarEntry | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadScript() {
            if (!scriptId) return
            setIsGenerating(true)
            setError(null)
            try {
                const script = await fetchScript(scriptId)
                setTitle(script.title)
                setContent(script.content)
                setPlatform(script.platform)
                setTopic(script.topic)
                setTone(script.tone)
                setLength(script.length || '60s')
                setLanguage(script.language || 'English')
                setFramework(script.framework || 'None')
                setCalendarDays(script.calendarDays || 0)
            } catch (err) {
                console.error('Error loading script:', err)
                setError(err instanceof Error ? err.message : 'Failed to load script.')
            } finally {
                setIsGenerating(false)
            }
        }
        loadScript()
    }, [scriptId])

    const handleGenerate = async () => {
        if (!topic) return
        setIsGenerating(true)
        setIsSaved(false)
        setError(null)
        try {
            if (calendarDays > 0) {
                const result = await generateCalendar({ platform, topic, tone, length, language, framework, days: calendarDays })
                setTitle(`${calendarDays}-Day ${topic} Calendar`)
                setContent(result as CalendarEntry[])
            } else {
                const result = await generateScript({ platform, topic, tone, length, language, framework })
                setTitle(result.title)
                setContent(result.content as ScriptRow[])
            }
        } catch (err) {
            console.error('Error generating content:', err)
            setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSave = async () => {
        if (!content || content.length === 0) return
        setIsSaving(true)
        setError(null)
        try {
            const result = await saveScript({
                id: scriptId || undefined,
                title,
                content: content as ScriptRow[] | CalendarEntry[],
                platform,
                topic,
                tone,
                length,
                language,
                framework,
                calendarDays: calendarDays > 0 ? calendarDays : undefined
            })

            if (result.success) {
                setIsSaved(true)
                setTimeout(() => setIsSaved(false), 3000)

                // If it was a new script, redirect to the editor with the new ID
                if (!scriptId && result.data && 'id' in result.data) {
                    router.push(`/editor?id=${result.data.id}`)
                }
            }
        } catch (err: any) {
            console.error('Error saving script:', err)
            const msg = err.message || 'Failed to save script.'
            setError(msg)
            alert(`Error: ${msg}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!scriptId) return
        if (!confirm('Are you sure you want to delete this script?')) return

        setIsDeleting(true)
        setError(null)
        try {
            await deleteScript(scriptId)
            router.push('/dashboard')
        } catch (err) {
            console.error('Error deleting script:', err)
            setError(err instanceof Error ? err.message : 'Failed to delete script.')
            setIsDeleting(false)
        }
    }

    const handleCopy = () => {
        if (!content || content.length === 0) return
        let textToCopy = ''
        if (calendarDays > 0) {
            textToCopy = (content as CalendarEntry[]).map(entry =>
                `DAY ${entry.day}: ${entry.title}\n` +
                entry.script.map(row => `[VISUAL]: ${row.visual}\n[AUDIO]: ${row.audio}`).join('\n')
            ).join('\n\n---\n\n')
        } else {
            textToCopy = (content as ScriptRow[]).map(row => `[VISUAL]: ${row.visual}\n[AUDIO]: ${row.audio}`).join('\n\n')
        }
        navigator.clipboard.writeText(textToCopy)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const updateRow = (index: number, field: 'visual' | 'audio', value: string) => {
        if (calendarDays > 0) return
        const newContent = [...(content as ScriptRow[])]
        newContent[index] = { ...newContent[index], [field]: value }
        setContent(newContent)
    }

    const addRow = () => {
        if (calendarDays > 0) return
        setContent([...(content as ScriptRow[]), { visual: '', audio: '' }])
    }

    const removeRow = (index: number) => {
        if (calendarDays > 0) return
        const newContent = (content as ScriptRow[]).filter((_, i) => i !== index)
        setContent(newContent)
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden font-sans">
            <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black px-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors" prefetch={false}>
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={scriptId ? 'Loading script...' : 'Untitled Script'}
                            className="bg-transparent border-none p-0 text-lg font-bold tracking-tight text-foreground focus:ring-0 w-[300px] outline-none placeholder:text-muted-foreground/50"
                        />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold ml-0.5 mt-[-2px]">
                            {platform} • {tone}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!content || content.length === 0 || isGenerating}
                        className="h-9"
                    >
                        {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {isCopied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!content || content.length === 0 || isSaving || isSaved || isGenerating || isDeleting}
                        className="h-9"
                    >
                        {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isSaved ? (
                            <Check className="mr-2 h-4 w-4" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSaving ? 'Saving' : isSaved ? 'Saved' : 'Save Script'}
                    </Button>
                    {scriptId && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting || isGenerating || isSaving}
                            className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            {isDeleting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[340px] flex-shrink-0 border-r border-white/10 p-8 overflow-y-auto bg-black">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Platform</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {platforms.map((p) => {
                                    const Icon = p.icon
                                    return (
                                        <button
                                            key={p.id}
                                            disabled={isGenerating}
                                            onClick={() => setPlatform(p.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-300",
                                                platform === p.id
                                                    ? "border-primary bg-primary/10 text-primary shadow-xl shadow-primary/10 scale-[1.02]"
                                                    : "border-white/10 text-muted-foreground hover:border-primary/30 hover:bg-primary/5",
                                                isGenerating && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <Icon className="mb-3 h-7 w-7" />
                                            <span className="text-[11px] font-black uppercase tracking-wider">{p.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="topic" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Topic</Label>
                            <Input
                                id="topic"
                                disabled={isGenerating}
                                placeholder="e.g. Next.js 14 Server Actions"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-14 rounded-2xl px-5 font-medium"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="tone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Tone</Label>
                            <select
                                id="tone"
                                disabled={isGenerating}
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="flex h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium focus-visible:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-white"
                            >
                                {tones.map((t) => (
                                    <option key={t} value={t} className="bg-black py-2">
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="length" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Length</Label>
                            <Input
                                id="length"
                                disabled={isGenerating}
                                placeholder="e.g. 60s, 2m, 5 minutes"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-14 rounded-2xl px-5 font-medium"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Language</Label>
                            <select
                                id="language"
                                disabled={isGenerating}
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="flex h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium focus-visible:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-white"
                            >
                                {languages.map((l) => (
                                    <option key={l} value={l} className="bg-black py-2">
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="framework" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Framework</Label>
                            <select
                                id="framework"
                                disabled={isGenerating}
                                value={framework}
                                onChange={(e) => setFramework(e.target.value)}
                                className="flex h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium focus-visible:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer text-white"
                            >
                                {frameworks.map((f) => (
                                    <option key={f} value={f} className="bg-black py-2">
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Content Calendar</Label>
                                {calendarDays > 0 && (
                                    <button
                                        onClick={() => setCalendarDays(0)}
                                        className="text-[10px] font-bold text-destructive hover:underline"
                                    >
                                        Disable
                                    </button>
                                )}
                            </div>
                            <div className="relative group">
                                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="number"
                                    min="0"
                                    max="365"
                                    disabled={isGenerating}
                                    placeholder="Number of days (e.g. 7, 30)"
                                    value={calendarDays || ''}
                                    onChange={(e) => setCalendarDays(parseInt(e.target.value) || 0)}
                                    className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-14 rounded-2xl pl-12 pr-5 font-medium"
                                />
                            </div>
                            <div className="flex gap-2">
                                {[7, 15, 30].map(d => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setCalendarDays(d)}
                                        className={cn(
                                            "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all",
                                            calendarDays === d
                                                ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5"
                                                : "border-white/10 text-muted-foreground hover:border-primary/30"
                                        )}
                                    >
                                        {d} Days
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-sm font-black bg-primary hover:bg-primary/90 text-white rounded-2xl active:scale-[0.98] transition-all group"
                            onClick={handleGenerate}
                            disabled={!topic || isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Crafting...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                                    Generate
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-semibold animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Editor */}
                <main className="flex-1 p-6 sm:p-12 overflow-y-auto relative bg-black/95">
                    {isGenerating && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-white/5 shadow-2xl animate-in zoom-in-95 duration-200">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="text-sm font-semibold text-white animate-pulse">AI is crafting your script...</p>
                            </div>
                        </div>
                    )}

                    <div className="mx-auto max-w-7xl w-full flex flex-col gap-6">
                        {calendarDays > 0 && Array.isArray(content) && content.length > 0 && 'day' in content[0] ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(content as CalendarEntry[]).map((entry, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setViewingEntry(entry)}
                                        className="flex flex-col border border-white/10 bg-white/5 shadow-xl overflow-hidden group hover:border-primary/30 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] rounded-3xl"
                                    >
                                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Day {entry.day}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">{platform}</span>
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4 flex-1">
                                            <h3 className="text-lg font-bold leading-tight line-clamp-2 text-white group-hover:text-primary transition-colors">{entry.title}</h3>
                                            <div className="space-y-3">
                                                {entry.script.slice(0, 1).map((row, sIdx) => (
                                                    <div key={sIdx} className="space-y-1">
                                                        <p className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/40 text-center border-y border-white/5 py-1 mb-2">Preview</p>
                                                        <p className="text-sm text-foreground/80 line-clamp-4 italic font-medium leading-relaxed">&quot;{row.audio}&quot;</p>
                                                    </div>
                                                ))}
                                                <div className="flex items-center justify-center pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                        View Full Script
                                                        <ChevronLeft className="h-3 w-3 rotate-180" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Card className="flex flex-col border-white/10 bg-white/5 shadow-2xl overflow-hidden transition-all duration-300 min-h-[75vh]">
                                {content && content.length > 0 ? (
                                    <div className="flex flex-col h-full">
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="border-b border-white/10 bg-white/5">
                                                        <th className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 w-[35%] border-r border-white/5">See (Visual)</th>
                                                        <th className="text-left py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Hear (Audio)</th>
                                                        <th className="w-16"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/10">
                                                    {(content as ScriptRow[]).map((row, idx) => (
                                                        <tr key={idx} className="group hover:bg-primary/[0.02] transition-colors">
                                                            <td className="align-top border-r border-white/5 p-0">
                                                                <textarea
                                                                    className="w-full min-h-[100px] bg-transparent border-none p-8 text-[15px] leading-relaxed resize-none focus:ring-0 placeholder:text-muted-foreground/20 font-medium text-foreground/80 outline-none"
                                                                    value={row.visual}
                                                                    onChange={(e) => updateRow(idx, 'visual', e.target.value)}
                                                                    placeholder="Scene description..."
                                                                />
                                                            </td>
                                                            <td className="align-top p-0">
                                                                <textarea
                                                                    className="w-full min-h-[100px] bg-transparent border-none p-8 text-[17px] md:text-[18px] leading-[1.7] resize-none focus:ring-0 placeholder:text-muted-foreground/20 font-normal text-foreground/90 outline-none"
                                                                    value={row.audio}
                                                                    onChange={(e) => updateRow(idx, 'audio', e.target.value)}
                                                                    placeholder="Audio text..."
                                                                />
                                                            </td>
                                                            <td className="px-4 py-6 align-top">
                                                                <button
                                                                    onClick={() => removeRow(idx)}
                                                                    className="text-muted-foreground/20 hover:text-destructive transition-colors p-1"
                                                                    title="Remove row"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="p-8 border-t border-white/10 bg-white/5 flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={addRow}
                                                className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Row
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-1 flex-col items-center justify-center text-center py-32 px-8">
                                        <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center mb-8 border border-primary/10">
                                            <Sparkles className="h-12 w-12 text-primary/40" />
                                        </div>
                                        <h2 className="text-3xl font-black mb-4 tracking-tight text-white">Ready to create?</h2>
                                        <p className="max-w-md text-muted-foreground text-lg leading-relaxed font-medium">
                                            Enter a topic and tone on the left, then click Generate to let the AI build your structured script.
                                        </p>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                </main>
            </div>

            {/* Expanded View Modal */}
            {viewingEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all animate-in fade-in"
                        onClick={() => setViewingEntry(null)}
                    />
                    <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 rounded-[32px]">
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Day {viewingEntry.day} • {platform}</span>
                                <h2 className="text-2xl font-black tracking-tight text-white">{viewingEntry.title}</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingEntry(null)}
                                className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md z-10">
                                        <th className="text-left py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 w-[35%] border-r border-white/5">See (Visual)</th>
                                        <th className="text-left py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Hear (Audio)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {viewingEntry.script.map((row, idx) => (
                                        <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="align-top border-r border-white/5 p-8 text-[14px] leading-relaxed text-muted-foreground/90 font-medium">
                                                {row.visual}
                                            </td>
                                            <td className="align-top p-8 text-[16px] md:text-[18px] leading-[1.7] text-white font-normal">
                                                &quot;{row.audio}&quot;
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end gap-3">
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10" onClick={() => {
                                const text = viewingEntry.script.map(r => `[VISUAL]: ${r.visual}\n[AUDIO]: ${r.audio}`).join('\n\n')
                                navigator.clipboard.writeText(text)
                                setIsCopied(true)
                                setTimeout(() => setIsCopied(false), 2000)
                            }}>
                                <Copy className="mr-2 h-4 w-4" />
                                {isCopied ? 'Copied' : `Copy Day ${viewingEntry.day}`}
                            </Button>
                            <Button size="sm" className="bg-white text-black hover:bg-white/90" onClick={() => setViewingEntry(null)}>
                                Close
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <EditorContent />
        </Suspense>
    )
}
