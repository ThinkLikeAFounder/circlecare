import { CodeBracketIcon, LockClosedIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const clarityFeatures = [
  {
    name: 'contract-hash?',
    description: 'Ensures contract integrity and security by verifying contract hashes.',
    icon: LockClosedIcon,
  },
  {
    name: 'restrict-assets?',
    description: 'Protects your assets with fine-grained access controls and restrictions.',
    icon: LockClosedIcon,
  },
  {
    name: 'stacks-block-time',
    description: 'Enables time-based operations and expirations with blockchain precision.',
    icon: ClockIcon,
  },
  {
    name: 'to-ascii?',
    description: 'Handles data encoding and decoding for secure data transmission.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Contract Verification',
    description: 'Verify all contract interactions on the blockchain for full transparency.',
    icon: DocumentTextIcon,
  },
];

export function ClarityShowcase() {
  return (
    <section className="py-16 bg-gray-50" id="clarity">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Powered by Clarity 4
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            CircleCare leverages the security and flexibility of Clarity 4 for smart contract execution.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {clarityFeatures.map((feature) => (
            <div key={feature.name} className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full border border-gray-200">
                <div className="-mt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 text-center">
                    {feature.name}
                  </h3>
                  <p className="mt-3 text-base text-gray-600 text-center">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white shadow rounded-lg p-6">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <CodeBracketIcon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <h3 className="text-lg font-medium text-gray-900">Smart Contract Security</h3>
              <p className="mt-2 text-base text-gray-600">
                Our smart contracts are built with security as a top priority, utilizing Clarity 4's
                built-in security features to protect your assets and ensure proper execution of all
                transactions.
              </p>
              <div className="mt-4">
                <a
                  href="#"
                  className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View smart contract documentation →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
