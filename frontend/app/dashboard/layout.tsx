export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
      </nav>
      {children}
    </div>
  )
}