import { Button } from '@/components/ui/button'
import { FlaskConical, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils/cn'

const tiers = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for exploring the power of AI generation.',
        features: ['3 Scripts / mo', 'GPT-4o Creative Engine', 'Standard Metrics', 'Cloud Storage'],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Professional',
        price: '$19',
        description: 'For serious creators who need constant output.',
        features: ['Unlimited Scripts', 'Engine Priority Access', 'Neural Multi-Tone', 'Advanced Logic'],
        cta: 'Go Pro',
        popular: true,
    },
    {
        name: 'Agency',
        price: 'Custom',
        description: 'Tailored solutions for teams and agencies.',
        features: ['Team Accounts', 'API Access', 'Custom AI Training', 'Dedicated Support'],
        cta: 'Contact Sales',
        popular: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-32 relative overflow-hidden bg-soft/50">
            <div className="container mx-auto px-8">
                <div className="flex flex-col items-center text-center mb-24">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-orange mb-4">Simple Pricing</div>
                    <h2 className="text-5xl md:text-7xl font-black text-navy uppercase tracking-tighter mb-6">Flexible <br /> Plans.</h2>
                    <p className="text-muted-foreground text-xl max-w-2xl font-medium">
                        Select the plan that aligns with your content creation journey. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "relative p-12 rounded-[2.5rem] bg-white border border-border transition-all duration-500 group",
                                tier.popular ? "shadow-premium border-navy ring-4 ring-navy/5 scale-105 z-10" : "shadow-soft hover:shadow-premium"
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                                    <FlaskConical className="h-3 w-3" />
                                    Optimized Path
                                </div>
                            )}

                            <div className="mb-10 text-center md:text-left">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange mb-4">{tier.name}</h3>
                                <div className="flex items-baseline justify-center md:justify-start gap-1">
                                    <span className="text-6xl font-black tracking-tighter text-navy">{tier.price}</span>
                                    {tier.price !== 'Free' && tier.price !== 'Custom' && (
                                        <span className="text-muted-foreground font-black text-xs uppercase tracking-widest ml-1">/ Month</span>
                                    )}
                                </div>
                                <p className="text-muted-foreground mt-6 text-sm font-medium leading-relaxed">
                                    {tier.description}
                                </p>
                            </div>

                            <div className="space-y-5 mb-12">
                                {tier.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-4 text-xs font-bold text-navy">
                                        <div className={cn("p-1.5 rounded-full", tier.popular ? "bg-orange/10" : "bg-soft")}>
                                            <ShieldCheck className={cn("h-4 w-4", tier.popular ? "text-orange" : "text-navy/40")} />
                                        </div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/login">
                                <Button
                                    className={cn(
                                        "w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        tier.popular
                                            ? "bg-navy hover:bg-navy/90 text-white shadow-premium"
                                            : "bg-white border-2 border-border text-navy hover:border-navy"
                                    )}
                                >
                                    {tier.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
