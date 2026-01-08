import {
    Zap,
    Target,
    Layout,
    Cpu,
    CheckCircle2,
    Globe
} from 'lucide-react'

const features = [
    {
        title: 'AI Generation',
        description: 'Powered by GPT-4o for the most creative and context-aware scripts.',
        icon: Cpu,
    },
    {
        title: 'Platform Optimized',
        description: 'Specific formatting for YouTube chapters, hooks, and LinkedIn posts.',
        icon: Target,
    },
    {
        title: 'Tone Control',
        description: 'Choose from 6+ professional tones to match your personal brand.',
        icon: Zap,
    },
    {
        title: 'Clean Editor',
        description: 'Focus on your content with our distraction-free split-screen editor.',
        icon: Layout,
    },
    {
        title: 'Instant Copy',
        description: 'Copy your generated script to clipboard with a single click.',
        icon: CheckCircle2,
    },
    {
        title: 'Cloud Storage',
        description: 'Your scripts are automatically saved and accessible from anywhere.',
        icon: Globe,
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Everything to go <span className="text-primary italic">Viral</span>.</h2>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        ScriptGo is packed with features designed for content creators who value speed and quality.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={idx}
                                className="p-8 rounded-3xl card card-hover transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 border border-primary/10 group-hover:bg-primary/20 transition-all duration-500">
                                    <Icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-[15px]">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
