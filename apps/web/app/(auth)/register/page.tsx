import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Criar conta — ShinobiOps",
  description: "Crie sua conta no ShinobiOps",
}

// Server Component: just renders the client form.
// Redirect logic for already-authenticated users is handled by middleware.
export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Crie sua conta</h2>
        <p className="mt-0.5 text-sm text-white/50">Crie seu perfil</p>
      </div>
      <RegisterForm />
    </>
  )
}
