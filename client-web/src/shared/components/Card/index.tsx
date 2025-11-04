/* 🎨 COMPONENTE BASE: Card */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function Card({
  className = "",
  hover = false,
  padding = "md",
  children
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <div
      className={`
      bg-white rounded-xl shadow-sm border border-slate-200
      ${
        hover
          ? "hover:shadow-md hover:border-purple-300 transition-all duration-200"
          : ""
      }
      ${paddingClasses[padding]}
      ${className}
    `}
    >
      {children}
    </div>
  );
}
