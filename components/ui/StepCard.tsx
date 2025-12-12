interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
  tipType?: 'info' | 'success' | 'warning';
  icon: string;
  gradient?: string;
}

export function StepCard({ 
  stepNumber, 
  title, 
  description, 
  tip, 
  tipType = 'info',
  icon,
  gradient = "from-blue-400 to-purple-500"
}: StepCardProps) {
  const tipColors = {
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    success: 'bg-green-50 border-green-400 text-green-800',
    warning: 'bg-orange-50 border-orange-400 text-orange-800'
  };

  const stepColors = {
    1: 'bg-blue-500',
    2: 'bg-green-500',
    3: 'bg-purple-500',
    4: 'bg-orange-500',
    5: 'bg-indigo-500'
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
      <div className={stepNumber % 2 === 0 ? 'order-2 lg:order-1' : ''}>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className={`w-24 h-24 bg-gradient-to-br ${gradient} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl`}>
              {icon}
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
      </div>
      <div className={stepNumber % 2 === 0 ? 'order-1 lg:order-2' : ''}>
        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 ${stepColors[stepNumber as keyof typeof stepColors]} text-white rounded-full flex items-center justify-center font-bold text-xl mr-4`}>
            {stepNumber}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        </div>
        <p className="text-lg text-gray-600 mb-6">{description}</p>
        {tip && (
          <div className={`${tipColors[tipType]} border-l-4 p-4 rounded`}>
            <p>
              <strong>{tipType === 'info' ? 'Tip:' : tipType === 'success' ? 'Examples:' : 'Note:'}</strong> {tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}