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
    ArrowRight,
    FileText
} from 'lucide-react'

import Link from 'next/link'
import Image from 'next/image'
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
                // If it was a new script, redirect to the editor with the new ID
                if (!scriptId && result.data && 'id' in result.data) {
                    router.push(`/editor?id=${result.data.id}`)
                }
            }
        } catch (err) {
            console.error('Error saving script:', err)
            const msg = err instanceof Error ? err.message : 'Failed to save script.'
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
        <div className="flex h-screen flex-col bg-transparent font-sans text-navy selection:bg-orange/20">
            {/* Header / Brand Bar */}
            <header className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-6 sm:px-12">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-3 group transition-all">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white shadow-soft group-hover:scale-110 active:scale-95 transition-all">
                            <ChevronLeft className="h-5 w-5 text-navy" />
                        </div>
                    </Link>
                    <div className="h-8 w-[1px] bg-border/60 mx-2" />
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-border shadow-premium overflow-hidden relative">
                            <Image src="/assets/logo.png" alt="Logo" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-black uppercase tracking-tighter leading-none text-navy">
                                {title || "Initial Creation"}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-orange uppercase tracking-widest">Creative Agent</span>
                                <div className="h-1 w-1 rounded-full bg-border" />
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{platform} • {tone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-soft/30 border border-border text-[10px] font-black uppercase tracking-widest text-navy/40">
                        Agent Engine v2.0 <Sparkles className="h-3 w-3 text-orange animate-pulse" />
                    </div>
                    {scriptId && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting || isGenerating || isSaving}
                            className="h-10 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
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

            <div className="flex-1 overflow-y-auto px-6 py-12 sm:px-12">
                <div className="max-w-5xl mx-auto space-y-12 pb-20">

                    {/* Centered Glassmorphism Form */}
                    <Card className="border-border bg-white/40 backdrop-blur-xl shadow-premium rounded-[3rem] p-8 md:p-12 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="h-24 w-24 text-navy rotate-12" />
                        </div>

                        <div className="relative z-10 space-y-10">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-navy">Configure Agent Logic</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Professional Content Parameters</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Column 1 */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Target Platform</Label>
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
                                                                ? "border-navy bg-navy text-white shadow-xl shadow-navy/10 scale-[1.02]"
                                                                : "border-border bg-white text-muted-foreground hover:border-navy/30 hover:bg-soft",
                                                            isGenerating && "opacity-50 cursor-not-allowed"
                                                        )}
                                                    >
                                                        <Icon className="mb-2 h-6 w-6" />
                                                        <span className="text-[10px] font-black uppercase tracking-wider">{p.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="topic" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Core Topic</Label>
                                        <Input
                                            id="topic"
                                            disabled={isGenerating}
                                            placeholder="What should the agent create?"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            className="bg-white border-border focus:border-navy/50 transition-all h-14 rounded-2xl px-5 font-medium shadow-soft"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="language" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Output Language</Label>
                                        <select
                                            id="language"
                                            disabled={isGenerating}
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="flex h-14 w-full rounded-2xl border border-border bg-white px-5 py-2 text-sm font-medium focus-visible:outline-none focus:border-navy/50 transition-all appearance-none cursor-pointer text-navy shadow-soft"
                                        >
                                            {languages.map((l) => (
                                                <option key={l} value={l} className="bg-white py-2">
                                                    {l}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <Label htmlFor="tone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Voice Tone</Label>
                                            <select
                                                id="tone"
                                                disabled={isGenerating}
                                                value={tone}
                                                onChange={(e) => setTone(e.target.value)}
                                                className="flex h-14 w-full rounded-2xl border border-border bg-white px-5 py-2 text-sm font-medium focus-visible:outline-none focus:border-navy/50 transition-all appearance-none cursor-pointer text-navy shadow-soft"
                                            >
                                                {tones.map((t) => (
                                                    <option key={t} value={t} className="bg-white py-2">
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <Label htmlFor="length" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Duration</Label>
                                            <Input
                                                id="length"
                                                disabled={isGenerating}
                                                placeholder="60s, 2m..."
                                                value={length}
                                                onChange={(e) => setLength(e.target.value)}
                                                className="bg-white border-border focus:border-navy/50 transition-all h-14 rounded-2xl px-5 font-medium shadow-soft"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label htmlFor="framework" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Marketing Framework</Label>
                                        <select
                                            id="framework"
                                            disabled={isGenerating}
                                            value={framework}
                                            onChange={(e) => setFramework(e.target.value)}
                                            className="flex h-14 w-full rounded-2xl border border-border bg-white px-5 py-2 text-sm font-medium focus-visible:outline-none focus:border-navy/50 transition-all appearance-none cursor-pointer text-navy shadow-soft"
                                        >
                                            {frameworks.map((f) => (
                                                <option key={f} value={f} className="bg-white py-2">
                                                    {f}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Content Calendar (Days)</Label>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    disabled={isGenerating}
                                                    value={calendarDays}
                                                    onChange={(e) => setCalendarDays(Math.max(0, parseInt(e.target.value) || 0))}
                                                    className="bg-white border-border focus:border-navy/50 transition-all h-14 rounded-2xl px-5 font-bold shadow-soft text-navy"
                                                />
                                            </div>
                                            <div className="flex items-center px-6 rounded-2xl bg-soft/30 border border-border">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">
                                                    {calendarDays === 0 ? 'Single Script' : `${calendarDays} Days Sequence`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-center">
                                <Button
                                    className="h-16 px-12 text-sm font-black uppercase tracking-widest bg-navy hover:bg-navy/90 text-white rounded-2xl active:scale-[0.98] transition-all group shadow-premium min-w-[300px]"
                                    onClick={handleGenerate}
                                    disabled={!topic || isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                            Agent Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                                            Generate Content
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-semibold animate-in fade-in slide-in-from-top-1 text-center">
                                {error}
                            </div>
                        )}
                    </Card>

                    {/* Results Area */}
                    <div className="relative">
                        {isGenerating && (
                            <div className="flex items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-500">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-orange/20 blur-3xl rounded-full animate-pulse" />
                                        <div className="relative h-20 w-20 flex items-center justify-center bg-white border border-border rounded-[2rem] shadow-premium">
                                            <Loader2 className="h-10 w-10 text-navy animate-spin" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-black uppercase tracking-tighter text-navy mb-1 animate-pulse">Orchestrating Logic...</p>
                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Constructing high-impact high-visual sequences</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isGenerating && content && content.length > 0 && (
                            <Card className="border-border bg-white shadow-premium-hover rounded-[3.52rem] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                                {/* Result Header & Actions */}
                                <div className="p-10 border-b border-border bg-soft/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-white border border-border shadow-soft flex items-center justify-center">
                                            <FileText className="h-7 w-7 text-orange" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter text-navy">{title || "Generated Script"}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Optimized for {platform} • {language}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={handleCopy}
                                            className="h-12 px-6 rounded-xl border-border bg-white text-[10px] font-black uppercase tracking-widest text-navy hover:bg-soft transition-all"
                                        >
                                            {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                                            {isCopied ? 'Copied' : 'Copy'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="h-12 px-6 rounded-xl border-border bg-white text-[10px] font-black uppercase tracking-widest text-navy hover:bg-soft transition-all"
                                        >
                                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            Save
                                        </Button>
                                        <Button
                                            onClick={handleGenerate}
                                            className="h-12 px-6 rounded-xl bg-orange hover:bg-orange/90 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-premium"
                                        >
                                            Regenerate
                                        </Button>
                                    </div>
                                </div>

                                {/* Content Display */}
                                <div className="p-0">
                                    {calendarDays > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-border border-t border-border">
                                            {(content as CalendarEntry[]).map((entry, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => setViewingEntry(entry)}
                                                    className="p-10 group hover:bg-soft/20 transition-all cursor-pointer relative"
                                                >
                                                    <div className="flex items-center justify-between mb-8">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-navy bg-white border border-border px-3 py-1 rounded-full shadow-soft">Day {entry.day}</span>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-orange transition-colors" />
                                                    </div>
                                                    <h4 className="text-xl font-black uppercase tracking-tighter leading-tight text-navy mb-6 group-hover:text-orange transition-colors line-clamp-3">
                                                        {entry.title}
                                                    </h4>
                                                    <div className="space-y-2 opacity-50 italic text-sm line-clamp-3 leading-relaxed">
                                                        &quot;{entry.script[0]?.audio}&quot;
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="border-b border-border bg-soft/20">
                                                        <th className="text-left py-6 px-10 text-[10px] font-black uppercase tracking-widest text-navy/40 w-[35%] border-r border-border">Visual Direction</th>
                                                        <th className="text-left py-6 px-10 text-[10px] font-black uppercase tracking-widest text-navy/40">Audio Sequence</th>
                                                        <th className="w-16"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {(content as ScriptRow[]).map((row, idx) => (
                                                        <tr key={idx} className="group hover:bg-soft/10 transition-colors">
                                                            <td className="align-top border-r border-border p-0">
                                                                <textarea
                                                                    className="w-full min-h-[160px] bg-transparent border-none p-10 text-sm leading-relaxed resize-none focus:ring-0 placeholder:text-muted-foreground/10 font-bold text-navy/70 outline-none"
                                                                    value={row.visual}
                                                                    onChange={(e) => updateRow(idx, 'visual', e.target.value)}
                                                                    placeholder="Describe visual context..."
                                                                />
                                                            </td>
                                                            <td className="align-top p-0">
                                                                <textarea
                                                                    className="w-full min-h-[160px] bg-transparent border-none p-10 text-lg md:text-xl leading-[1.7] resize-none focus:ring-0 placeholder:text-muted-foreground/10 font-black text-navy outline-none"
                                                                    value={row.audio}
                                                                    onChange={(e) => updateRow(idx, 'audio', e.target.value)}
                                                                    placeholder="Input sequence text..."
                                                                />
                                                            </td>
                                                            <td className="px-6 py-10 align-top">
                                                                <button
                                                                    onClick={() => removeRow(idx)}
                                                                    className="text-muted-foreground/10 hover:text-destructive transition-all p-2 hover:bg-destructive/5 rounded-lg opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="p-8 border-t border-border bg-soft/5 flex justify-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={addRow}
                                                    className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-navy hover:bg-white transition-all border border-transparent hover:border-border"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Script Block
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-10 border-t border-border bg-soft/20 flex flex-col items-center gap-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-navy/30">End of Content Stream</p>
                                    <div className="h-12 w-[1px] bg-border" />
                                </div>
                            </Card>
                        )}

                        {!isGenerating && (!content || content.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
                                <div className="w-24 h-24 rounded-[3rem] bg-white border border-border shadow-soft flex items-center justify-center mb-10 text-muted-foreground/20">
                                    <Sparkles className="h-12 w-12" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-widest text-navy/20">Agent Standby</h3>
                                <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mt-2">Awaiting configuration logic from above</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded View Modal */}
            {viewingEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all animate-in fade-in"
                        onClick={() => setViewingEntry(null)}
                    />
                    <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border bg-white shadow-premium flex flex-col animate-in zoom-in-95 duration-200 rounded-[3rem]">
                        <div className="flex items-center justify-between p-8 border-b border-border bg-soft/30">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange mb-1">Day {viewingEntry.day} • {platform}</span>
                                <h2 className="text-3xl font-black tracking-tighter text-navy uppercase">{viewingEntry.title}</h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setViewingEntry(null)}
                                className="rounded-2xl hover:bg-destructive/10 hover:text-destructive h-12 w-12"
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
                                        <tr key={idx} className="group hover:bg-soft/20 transition-colors">
                                            <td className="align-top border-r border-border p-8 text-[14px] leading-relaxed text-muted-foreground font-medium">
                                                {row.visual}
                                            </td>
                                            <td className="align-top p-8 text-[16px] md:text-[18px] leading-[1.7] text-navy font-bold">
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
