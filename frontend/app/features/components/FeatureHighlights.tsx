import { CheckCircleIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Circle Creation and Management',
    description: 'Easily create and manage circles for your community with intuitive controls.',
  },
  {
    name: 'Expense Tracking with Clarity 4',
    description: 'Track all expenses with our secure and transparent Clarity 4 integration.',
  },
  {
    name: 'Secure Settlements',
    description: 'Ensure secure transactions with our restrict-assets protection.',
  },
  {
    name: 'Time-based Expiration',
    description: 'Set expiration times for funds and actions to maintain financial discipline.',
  },
  {
    name: 'Contract Verification',
    description: 'Verify all transactions and contracts on the blockchain for complete transparency.',
  },
  {
    name: 'Real-time Updates',
    description: 'Get instant updates on all circle activities and transactions.',
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-12 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Feature Highlights
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to manage your community finances with confidence.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
