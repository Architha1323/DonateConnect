import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowRight, Package, Truck, Building2, BarChart3, Users, Recycle, Shield, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/ui/animated-section';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Card } from '@/components/ui/card';
import { HeroSlider } from '@/components/ui/hero-slider';
import { DonateButton } from '@/components/ui/donate-button';

const stats = [
  { label: 'Items Donated', value: 50000, suffix: '+', icon: Package },
  { label: 'NGOs Connected', value: 200, suffix: '+', icon: Building2 },
  { label: 'Cities Covered', value: 25, suffix: '+', icon: MapPin },
  { label: 'Lives Impacted', value: 100000, suffix: '+', icon: Users },
];

const howItWorks = [
  { step: '01', title: 'List Your Items', description: 'Upload photos and details of clothes, books, toys, or household items you want to donate.', icon: Package },
  { step: '02', title: 'Schedule Pickup', description: 'Choose a convenient date and time. Our pickup partners come to your doorstep.', icon: Truck },
  { step: '03', title: 'NGO Matching', description: 'We match your donation with verified NGOs based on location and needs.', icon: Building2 },
  { step: '04', title: 'Track & Impact', description: 'Track your donation journey and see the real impact you are making.', icon: BarChart3 },
];

const categories = [
  { name: 'Clothes', emoji: '👕', count: 15000 },
  { name: 'Books', emoji: '📚', count: 8000 },
  { name: 'Toys', emoji: '🧸', count: 5000 },
  { name: 'Furniture', emoji: '🪑', count: 2000 },
  { name: 'Kitchen Items', emoji: '🍳', count: 3000 },
  { name: 'Electronics', emoji: '📱', count: 1500 },
  { name: 'Stationery', emoji: '✏️', count: 4000 },
  { name: 'Household', emoji: '🏠', count: 6000 },
];

const features = [
  { title: 'Verified NGOs', description: 'Every NGO on our platform is thoroughly verified for authenticity and reliability.', icon: Shield },
  { title: 'Doorstep Pickup', description: 'No hassle. Schedule a free doorstep pickup at your convenience.', icon: Truck },
  { title: 'Transparent Tracking', description: 'Follow your donation from pickup to distribution with real-time updates.', icon: BarChart3 },
  { title: 'Sustainable Impact', description: 'Reduce waste, support communities, and contribute to a circular economy.', icon: Recycle },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      
      {/* Hero Section with Slider */}
      <section className="relative w-full">
        <HeroSlider />
      </section>

      {/* Stats Section (Floating over hero) */}
      <section className="relative z-30 -mt-8 md:-mt-12 px-4 pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[1.5rem] border border-white/40 dark:border-white/10 shadow-xl shadow-primary/5">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1} viewportMargin="0px" className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-transparent text-primary group-hover:scale-110 group-hover:from-primary/30 transition-all duration-300">
                  <stat.icon className="h-6 w-6 drop-shadow-sm" />
                </div>
                <div>
                  <div className="text-2xl md:text-4xl font-black text-foreground tracking-tight drop-shadow-sm">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} viewportMargin="0px" />
                  </div>
                  <p className="text-[14px] font-semibold text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Glassmorphism Grid */}
      <section className="py-24 md:py-32 bg-muted/30 dark:bg-black/20 border-y border-border/50 relative overflow-hidden">
        {/* Glowing orb in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <CheckCircle2 className="w-4 h-4" /> Simple Process
            </div>
            <h2 className="text-4xl md:text-[52px] font-extrabold tracking-tight text-foreground leading-tight">
              How It <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent drop-shadow-sm">Works</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">Four simple steps to make a profound difference in someone&apos;s life.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[44px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
            
            {howItWorks.map((item, index) => (
              <AnimatedSection key={item.step} delay={index * 0.1}>
                <Card className="h-full bg-card/80 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 p-8 space-y-6 shadow-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <span className="text-5xl font-black text-muted-foreground/20 dark:text-muted/10 group-hover:text-primary/20 transition-colors duration-500">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-[24px] font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-[16px] text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Pure Background */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-border/50 pb-8">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-[46px] font-extrabold tracking-tight text-foreground leading-tight">
                What Can You <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">Donate?</span>
              </h2>
              <p className="text-[17px] text-muted-foreground">We accept a wide range of reusable items in good condition to support communities.</p>
            </div>
            <DonateButton variant="outline" className="border-border hover:bg-muted/50 rounded-xl h-12 px-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <AnimatedSection key={cat.name} delay={index * 0.05}>
                <Card className="p-8 text-center space-y-4 border border-border/50 bg-muted/20 dark:bg-black/20 backdrop-blur-md hover:bg-card hover:border-primary/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300 group cursor-pointer">
                  <div className="text-6xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{cat.emoji}</div>
                  <h3 className="text-[22px] font-bold text-foreground">{cat.name}</h3>
                  <div className="text-[16px] text-muted-foreground font-semibold flex items-center justify-center gap-1 group-hover:text-primary transition-colors">
                    <AnimatedCounter value={cat.count} suffix="+" /> items
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Darker Glass Section */}
      <section className="py-24 md:py-32 bg-muted/50 dark:bg-black/30 border-y border-border/50 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 pr-0 lg:pr-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold backdrop-blur-md">
                  <Shield className="w-4 h-4" /> Trusted Platform
                </div>
                <h2 className="text-4xl md:text-[52px] font-extrabold tracking-tight text-foreground leading-tight">
                  Why Choose <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">DonateConnect?</span>
                </h2>
                <p className="text-[18px] text-muted-foreground">We make donating effortless, transparent, and incredibly impactful for everyone involved.</p>
              </div>
              
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <AnimatedSection key={feature.title} delay={index * 0.1} className="flex gap-6 items-start group">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-card dark:bg-white/5 border border-border shadow-lg text-primary group-hover:scale-110 group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all duration-300">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <h3 className="text-[22px] font-bold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-[16px] text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-white/20 dark:border-white/10 h-[500px] md:h-[650px]">
              <Image 
                src="/images/slide_10_ngo_distribution_1785048083559.png" 
                alt="NGO Distribution"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/20 to-transparent mix-blend-multiply dark:mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Deep Primary Green Background with Glows */}
      <section className="py-32 bg-gradient-to-br from-primary via-emerald-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-emerald-400/20 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Heart className="w-20 h-20 mx-auto text-white mb-8 animate-pulse drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" fill="currentColor" />
          <h2 className="text-4xl md:text-[56px] font-black tracking-tight text-white mb-6 leading-tight drop-shadow-xl">Ready to make a real difference?</h2>
          <p className="text-[18px] md:text-[20px] text-white/90 mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of donors giving items a second life and supporting communities in need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <DonateButton className="w-full sm:w-auto h-16 px-12 text-[18px] bg-white text-primary hover:bg-slate-100 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 hover:scale-105 rounded-2xl transition-all duration-300 font-bold" />
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-16 px-12 text-[18px] bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-xl rounded-2xl transition-all duration-300 font-bold">
              <Link href="/ngos">Browse NGOs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
