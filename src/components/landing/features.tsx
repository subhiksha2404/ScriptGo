import {
    Zap,
    Target,
    FlaskConical,
    Microscope,
    Atom,
    Activity
} from 'lucide-react'

const features = [
    {
        title: 'Creative Engine',
        description: 'GPT-4o powered generation engineered for distinct platform nuances.',
        icon: FlaskConical,
        category: 'Core'
    },
    {
        title: 'Viral Hooks',
        description: 'Professionally-tested structures to maximize initial viewer retention.',
        icon: Target,
        category: 'Growth'
    },
    {
        title: 'Multi-Tone Synth',
        description: '6+ professional tones calibrated for brand positioning.',
        icon: Microscope,
        category: 'Voice'
    },
    {
        title: 'Focus Canvas',
        description: 'Distraction-free environment conceptualized for deep script work.',
        icon: Atom,
        category: 'UX'
    },
    {
        title: 'Pulse Analytics',
        description: 'Integrated platform benchmarks to ensure content viability.',
        icon: Activity,
        category: 'Metrics'
    },
    {
        title: 'Zero Latency',
        description: 'Instant synchronization across the entire studio ecosystem.',
        icon: Zap,
        category: 'Speed'
    },
]

export function Features() {
    return (
        <section id="features" className="py-32 relative overflow-hidden bg-white">
            <div className="container mx-auto px-8">
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-orange mb-4">Creative Workflow</div>
                    <h2 className="text-5xl md:text-7xl font-black text-navy uppercase tracking-tighter mb-6">Built For <br /> Serious Creators.</h2>
                    <p className="text-muted-foreground text-xl max-w-2xl font-medium">
                        Our studio workspace is optimized for creators who treat content as a professional discipline.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={idx}
                                className="premium-card p-10 bg-white group hover:border-orange/30 transition-all duration-500"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-soft flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-all duration-500 shadow-soft">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-orange transition-colors">{feature.category}</span>
                                </div>
                                <h3 className="text-xl font-black text-navy uppercase mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed text-sm">
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
