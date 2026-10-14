interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning';
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'primary'
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses = {
    primary: 'bg-gradient-to-r from-primary to-tertiary',
    success: 'bg-tertiary',
    warning: 'bg-golden',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-on-surface">{label}</span>}
          {showPercentage && <span className="text-sm font-bold text-primary">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div
          className={`progress-fill ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
