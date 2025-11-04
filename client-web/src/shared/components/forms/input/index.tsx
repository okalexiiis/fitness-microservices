interface InputProps {
  placeholder?: string;
  type?: string;
  className?: string;
  [x: string]: any; // para {...register(name)}
}

export function Input({ type = "text", placeholder, className, ...rest }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`p-3 rounded-lg border focus:outline-none focus:ring-2 w-full ${className}`}
      {...rest}
    />
  );
}
