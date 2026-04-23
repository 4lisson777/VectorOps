import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Entrar — VectorOps",
  description: "Faça login no VectorOps",
}

// Server Component: just renders the client form.
// Redirect logic for already-authenticated users is handled by middleware.
export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Bem-vindo de volta</h2>
        <p className="mt-0.5 text-sm text-white/50">Faça login para continuar</p>
      </div>
      <LoginForm />
    </>
  )
}
