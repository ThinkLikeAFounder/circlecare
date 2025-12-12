'use client';

import { Button } from '@/components/ui/Button';
import { Circle, Heart, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Circle className="w-24 h-24 text-primary-500 animate-pulse-gentle" />
              <Heart className="w-12 h-12 text-accent-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">CircleCare</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-2xl mx-auto">
            Where care comes full circle
          </p>

          <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
            Transform expense sharing from tracking debts into flowing care.
            Built on Stacks Bitcoin L2 with Clarity 4.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/dashboard')}>
              Launch App
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/how-it-works')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          How CircleCare Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Circle className="w-12 h-12 text-primary-500" />}
            title="Create Your Circle"
            description="Start circles of care with the people who matter"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-secondary-500" />}
            title="Share Care"
            description="Track contributions transparently where every gesture counts"
          />
          <FeatureCard
            icon={<Heart className="w-12 h-12 text-accent-500" />}
            title="Complete the Circle"
            description="Fair reciprocity that feels fair and is fair"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Built on Clarity 4
            </h2>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Enhanced security with restrict-assets protection</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Contract integrity verification</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Time-based expense expiration</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Secured by Bitcoin through Stacks L2</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="circlecare-card p-8 animate-flow">
              <div className="text-center">
                <div className="text-6xl font-bold gradient-text mb-2">
                  100%
                </div>
                <p className="text-white/60">Transparent & Secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="circlecare-card p-12 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Ready to Join the Circle?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Start your first circle of care today
          </p>
          <Button size="lg" onClick={() => router.push('/dashboard')}>
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="circlecare-card p-8 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
