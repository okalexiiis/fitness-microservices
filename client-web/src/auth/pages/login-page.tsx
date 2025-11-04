import { LoginForm } from "@auth/components/forms/LoginForm";

export function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-purple-200">
      <section className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white font-body space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo.svg" alt="Logo" className="h-auto w-24" />
        </div>

        {/* Header y subtitulo */}
        <header className="text-3xl font-display text-purple-900 text-center font-semibold">
          Bienvenido de vuelta :D
        </header>
        <p className="text-center text-purple-600 font-medium">
          Inicia sesión y alcanza tus metas
        </p>

        {/* Formulario */}
        <LoginForm />

        {/* Footer */}
        <footer className="text-center space-y-2">
          <a
            href="#"
            className="text-purple-700 hover:text-purple-900 font-medium block"
          >
            Únete a nosotros
          </a>
          <a
            href="#"
            className="text-purple-500 hover:text-purple-700 font-medium block"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </footer>
      </section>
    </div>
  );
}
