import { Card } from "@shared/components/Card";

interface FavoriteCardProps {
  title: string;
  name: string;
  subtitle: string;
  emoji: string;
}

export function FavoriteCard({ title, name, subtitle, emoji }: FavoriteCardProps) {
  return (
    <Card hover padding="lg">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-14 h-14 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">
            {title}
          </p>
          <h3 className="text-lg font-bold text-slate-900 truncate">{name}</h3>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}
