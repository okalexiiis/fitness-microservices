import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormField } from "@shared/components/forms/form-field";
import { Input } from "@shared/components/forms/input";
import { loginRequest, LoginSchema, type LoginDTO } from "@auth/api/login";
import { useState } from "react";
import { redirect } from "react-router";
import { useAuthStore } from "@auth/hooks/auth.store";

export function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginDTO> = async (data) => {
    setErrorMsg(null);
    try {
      const res = await loginRequest(data);
      useAuthStore.getState().setAuth(res.data);
      redirect("/");
    } catch (err: any) {
      if ("message" in err) setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="text-red-600 bg-red-300/50 h-12 rounded-lg py-4 text-center font-medium">
          {errorMsg}
        </div>
      )}

      <FormField label="Email" name="email" errors={errors}>
        <Input
          type="email"
          placeholder="correo@ejemplo.com"
          {...register("email")}
          className={
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-purple-300 focus:ring-purple-500"
          }
        />
      </FormField>

      <FormField label="Contraseña" name="password" errors={errors}>
        <Input
          type="password"
          placeholder="********"
          {...register("password")}
          className={
            errors.password
              ? "border-red-500 focus:ring-red-500"
              : "border-purple-300 focus:ring-purple-500"
          }
        />
      </FormField>

      {/* Botón */}
      <button
        type="submit"
        className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition transform hover:scale-105 duration-200"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
