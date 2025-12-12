export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Circles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Family Expenses</h3>
          <p className="text-gray-600 mb-4">3 members • $245.50 total</p>
          <button className="btn-primary w-full">View Circle</button>
        </div>
      </div>
    </div>
  )
}