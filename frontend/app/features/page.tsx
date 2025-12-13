import { Metadata } from 'next';
import { FeatureHighlights } from './components/FeatureHighlights';
import { ClarityShowcase } from './components/ClarityShowcase';
import { Testimonials } from './components/Testimonials';

export const metadata: Metadata = {
  title: 'Features | CircleCare',
  description: 'Discover the powerful features of CircleCare for managing community funds with transparency and security.',
  keywords: ['CircleCare features', 'community finance', 'expense tracking', 'secure settlements', 'blockchain', 'Stacks'],
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Powerful Features for Community Finance
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            CircleCare provides everything you need to manage community funds with transparency, security, and ease.
          </p>
        </div>

        <FeatureHighlights />
        <ClarityShowcase />
        <Testimonials />
      </div>
    </main>
  );
}
