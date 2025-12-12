import { Metadata } from 'next';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
  title: 'How CircleCare Works - Step-by-Step Guide',
  description: 'Learn how to use CircleCare for care-centered expense sharing. Create circles, add expenses, and settle balances with ease.',
  keywords: ['CircleCare tutorial', 'expense sharing guide', 'how to use CircleCare', 'Stacks wallet', 'STX payments'],
};

export default function HowItWorksPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-8">
              How CircleCare Works
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Transform your group expenses from debt tracking into flowing care with these simple steps
            </p>
          </div>

          {/* Step-by-Step Guide */}
          <section className="mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Connect Your Wallet</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Start by connecting your Stacks wallet (Leather, Xverse, or compatible). You'll need some STX tokens for transaction fees.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-blue-800">
                    <strong>Tip:</strong> Get testnet STX from the Hiro faucet to try CircleCare risk-free!
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                    🔗
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Wallet Connection</h4>
                  <p className="text-gray-600 text-sm">Secure, decentralized authentication</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                      ⭕
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Create Circle</h4>
                    <p className="text-gray-600 text-sm">Organize your community</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Create Your Circle</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Create a care circle for your group - roommates, family, friends, or any community. Give it a meaningful name that reflects your shared purpose.
                </p>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <p className="text-green-800">
                    <strong>Examples:</strong> "Apartment 4B", "Family Vacation", "Study Group Expenses"
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Add Members</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Invite people to your circle by adding their Stacks wallet addresses. Members can create expenses, contribute to the treasury, and participate in settlements.
                </p>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                  <p className="text-purple-800">
                    <strong>Note:</strong> Only circle creators can add or remove members for security.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                    👥
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Add Members</h4>
                  <p className="text-gray-600 text-sm">Build your care community</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                      💰
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Track Expenses</h4>
                    <p className="text-gray-600 text-sm">Transparent expense sharing</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    4
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Add Expenses</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  When someone pays for a shared expense, add it to the circle. Select who should share the cost, and CircleCare automatically calculates everyone's portion.
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                  <p className="text-orange-800">
                    <strong>Smart:</strong> Expenses are split equally among participants by default.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    5
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Settle & Flow</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Instead of tracking individual debts, CircleCare shows your net balance. Settle when convenient using STX transfers, or contribute to the circle treasury for automatic coverage.
                </p>
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded">
                  <p className="text-indigo-800">
                    <strong>Care Flow:</strong> Support flows naturally as members contribute when they can and receive when they need.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                    🔄
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Care Flows</h4>
                  <p className="text-gray-600 text-sm">Mutual support in action</p>
                </div>
              </div>
            </div>
          </section>

          {/* Visual Flow */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">The CircleCare Flow</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    🏠
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Create Circle</h4>
                  <p className="text-gray-600 text-sm">Organize your community</p>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    🛒
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Share Expenses</h4>
                  <p className="text-gray-600 text-sm">Add shared costs</p>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-purple-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    ⚖️
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Track Balance</h4>
                  <p className="text-gray-600 text-sm">See net position</p>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="text-center flex-1">
                  <div className="w-16 h-16 bg-indigo-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    💝
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Care Flows</h4>
                  <p className="text-gray-600 text-sm">Support each other</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Do I need cryptocurrency experience?</h4>
                  <p className="text-gray-600 mb-6">
                    No! CircleCare is designed for everyday users. You just need a Stacks wallet and some STX tokens. Our guides walk you through everything.
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 mb-3">How much does it cost to use?</h4>
                  <p className="text-gray-600 mb-6">
                    CircleCare is free to use. You only pay small blockchain transaction fees (usually less than $0.10 USD) when creating circles or settling expenses.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Is my data private?</h4>
                  <p className="text-gray-600 mb-6">
                    Circle names and expense amounts are public on the blockchain for transparency. However, no personal information is required or stored.
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 mb-3">What if someone leaves the circle?</h4>
                  <p className="text-gray-600 mb-6">
                    Circle creators can remove members. It's best to settle balances before someone leaves, but their expense history remains on the blockchain.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">Have more questions?</p>
                <a href="/docs/FAQ.md" className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  View Complete FAQ
                </a>
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