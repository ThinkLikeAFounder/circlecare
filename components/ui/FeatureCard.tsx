interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient?: string;
}

export function FeatureCard({ icon, title, description, gradient = "from-blue-400 to-purple-500" }: FeatureCardProps) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}