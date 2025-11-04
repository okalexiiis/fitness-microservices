import { Card } from "@shared/components/Card";

export interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  change: string;
  icon: React.ElementType;
  color: "orange" | "blue" | "green" | "purple";
}

export function StatCard({
  label,
  value,
  unit,
  change,
  icon: Icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  const isPositive = change.startsWith("+");

  return (
    <Card hover padding="md">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {change}
        </span>
      </div>

      <div>
        <p className="text-sm text-slate-600 mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          <span className="text-sm text-slate-500 font-medium">{unit}</span>
        </div>
      </div>
    </Card>
  );
}
