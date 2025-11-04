import { useAuthStore } from "@auth/hooks/auth.store";
import { useState } from "react";
import { TrendingUp, Heart, Flame, Activity, Calendar } from "lucide-react";
import { FavoriteCard } from "@users/components/FavoriteCard";
import { StatCard, type StatCardProps } from "@users/components/StatCard";
import { TimeRangeSelector } from "@users/components/DateSelector";

export function HomePage() {
  const user = useAuthStore()?.auth?.user;
  const [timeRange, setTimeRange] = useState("4weeks");

  const stats = [
    {
      label: "Calorías",
      value: 2200,
      unit: "kcal",
      change: "+5%",
      icon: Flame,
      color: "orange",
    },
    {
      label: "Proteínas",
      value: 130,
      unit: "g",
      change: "+12%",
      icon: TrendingUp,
      color: "blue",
    },
    {
      label: "Carbohidratos",
      value: 250,
      unit: "g",
      change: "-3%",
      icon: Activity,
      color: "green",
    },
    {
      label: "Grasas",
      value: 70,
      unit: "g",
      change: "+2%",
      icon: Heart,
      color: "purple",
    },
  ] satisfies StatCardProps[];

  const favoriteFood = { name: "Ensalada de pollo", calories: 350 };
  const favoriteExercise = { name: "Correr", duration: "30 min" };

  const timeRanges = [
    { value: "1week", label: "Última semana" },
    { value: "4weeks", label: "Últimas 4 semanas" },
    { value: "3months", label: "Últimos 3 meses" },
    { value: "1year", label: "Último año" },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con bienvenida */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              ¡Hola, {user?.name || "Atleta"}! 👋
            </h1>
            <p className="text-slate-600 mt-1">
              Aquí está tu resumen de actividad
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Sección de estadísticas */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">
              📊 Estadísticas
            </h2>
            <TimeRangeSelector
              value={timeRange}
              onChange={setTimeRange}
              options={timeRanges}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        {/* Sección de favoritos */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            ⭐ Tus Favoritos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FavoriteCard
              title="Comida favorita"
              name={favoriteFood.name}
              subtitle={`${favoriteFood.calories} kcal`}
              emoji="🍽️"
            />
            <FavoriteCard
              title="Ejercicio favorito"
              name={favoriteExercise.name}
              subtitle={favoriteExercise.duration}
              emoji="🏃‍♀️"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
