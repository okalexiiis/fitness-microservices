import { type FieldErrors, type FieldValues, type Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;              // 🔹 Tipado correcto
  errors?: FieldErrors<T>;
  children: React.ReactNode;   // 🔹 Componente de input / select / textarea
}

export function FormField<T extends FieldValues>({
  label,
  name,
  errors,
  children,
}: FormFieldProps<T>) {
  const error = errors?.[name];

  return (
    <div className="flex flex-col relative">
      <label className="mb-1 font-medium text-purple-700">{label}</label>
      {children}
      {error && <span className="text-red-500 text-sm mt-1">{error.message as string}</span>}
    </div>
  );
}
