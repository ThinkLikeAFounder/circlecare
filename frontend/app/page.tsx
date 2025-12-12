export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            CircleCare
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Transform expense sharing from tracking debts into flowing care within communities
          </p>
          <div className="space-x-4">
            <button className="btn-primary">
              Get Started
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}