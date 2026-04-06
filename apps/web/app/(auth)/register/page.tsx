import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Entrar para o Clã — ShinobiOps",
  description: "Crie sua conta no ShinobiOps",
}

// Server Component: just renders the client form.
// Redirect logic for already-authenticated users is handled by middleware.
export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Entre para o Clã</h2>
        <p className="mt-0.5 text-sm text-white/50">Crie seu perfil de shinobi</p>
      </div>
      <RegisterForm />
    </>
  )
}
