import { Metadata } from 'next';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
  title: 'About CircleCare - Care-Centered Expense Sharing',
  description: 'Learn about CircleCare\'s mission to transform expense sharing into flowing care within communities, built on Stacks with Clarity 4.',
  keywords: ['CircleCare', 'expense sharing', 'Stacks', 'Clarity 4', 'blockchain', 'community care'],
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
              About CircleCare
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Transforming expense sharing from tracking debts into flowing care within communities
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                CircleCare reimagines expense sharing by focusing on <strong>circles of mutual care</strong> rather than individual debts. 
                Instead of "you owe Alice $50," we recognize that communities operate through continuous flows of support—everyone 
                contributes when they can, everyone receives when they need, and care comes full circle.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Vision</h3>
                  <p className="text-gray-600">
                    A world where financial collaboration strengthens community bonds rather than creating transactional relationships.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-3">Values</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Community over individual transactions</li>
                    <li>• Care over debt tracking</li>
                    <li>• Transparency through blockchain</li>
                    <li>• Accessibility for everyone</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Built with Clarity 4</h2>
              <p className="text-lg text-gray-600 mb-8">
                CircleCare leverages the latest Clarity 4 features on the Stacks blockchain for enhanced security, 
                performance, and user experience.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Asset Protection</h4>
                  <p className="text-sm text-gray-600">restrict-assets? prevents unauthorized transfers</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">✅</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Contract Integrity</h4>
                  <p className="text-sm text-gray-600">contract-hash? ensures authentic interactions</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">⏰</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Time-Based Logic</h4>
                  <p className="text-sm text-gray-600">stacks-block-time enables expiring expenses</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl mb-2">🔗</div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cross-Chain Ready</h4>
                  <p className="text-sm text-gray-600">to-ascii? improves data serialization</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Team</h2>
              <p className="text-lg text-gray-600 mb-8">
                CircleCare is built by a passionate team of developers, designers, and community advocates 
                who believe in the power of care-centered technology.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    CC
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Core Contributors</h4>
                  <p className="text-gray-600 text-sm">
                    Blockchain developers and UX designers working together to create meaningful financial tools.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    OS
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Open Source</h4>
                  <p className="text-gray-600 text-sm">
                    Built in the open with contributions from the global Stacks and Web3 community.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    CM
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Community</h4>
                  <p className="text-gray-600 text-sm">
                    Guided by feedback from real communities using CircleCare for their expense sharing needs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Technology Stack</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">Smart Contracts</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>Clarity 4</strong> - Latest smart contract language</li>
                    <li>• <strong>Stacks Blockchain</strong> - Bitcoin Layer 2</li>
                    <li>• <strong>Clarinet 2.x</strong> - Development framework</li>
                    <li>• <strong>Vitest</strong> - Testing with clarinet-sdk</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-4">Frontend</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>Next.js 15</strong> - React framework</li>
                    <li>• <strong>TypeScript 5.x</strong> - Type safety</li>
                    <li>• <strong>Tailwind CSS 4</strong> - Utility-first CSS</li>
                    <li>• <strong>TanStack Query</strong> - Data fetching</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}