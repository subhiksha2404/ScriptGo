import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

const tiers = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for exploring the power of AI generation.',
        features: ['3 Scripts per month', 'GPT-4o Access', 'Basic Tones', 'Cloud Storage'],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$19',
        description: 'For serious creators who need constant output.',
        features: ['Unlimited Scripts', 'Priority Support', 'Custom Tones', 'Advanced SEO optimization'],
        cta: 'Go Pro',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Tailored solutions for teams and agencies.',
        features: ['Multiple Accounts', 'API Access', 'Custom AI Training', 'Dedicated Manager'],
        cta: 'Contact Sales',
        popular: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-10" />
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Simple <span className="text-accent italic">Pricing</span>.</h2>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        Choose the plan that&apos;s right for your content creation journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            className={`relative p-10 rounded-3xl card card-hover ${tier.popular
                                ? 'border-primary/50 ring-2 ring-primary/20 shadow-2xl shadow-primary/20 scale-105 z-10'
                                : ''
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-2xl font-black mb-2 tracking-tight">{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                                    {tier.price !== 'Free' && tier.price !== 'Custom' && (
                                        <span className="text-muted-foreground font-semibold text-lg">/mo</span>
                                    )}
                                </div>
                                <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
                                    {tier.description}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10">
                                {tier.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-3 text-sm font-medium">
                                        <div className="p-1 rounded-full bg-primary/10">
                                            <Check className="h-4 w-4 text-primary" />
                                        </div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/login">
                                <Button
                                    className={`w-full h-14 font-black transition-all rounded-2xl ${tier.popular ? 'btn-primary' : 'border-primary/20 hover:bg-primary/5'}`}
                                    variant={tier.popular ? 'default' : 'outline'}
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
