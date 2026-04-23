import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Criar conta — VectorOps",
  description: "Crie sua conta no VectorOps",
}

interface RegisterPageProps {
  searchParams: Promise<{ invite?: string }>
}

// Server Component: reads the optional ?invite=CODE query parameter and
// passes it to the client RegisterForm so users with invite links land
// directly in "join" mode with the code pre-filled.
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const inviteCode = params.invite ?? undefined

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Crie sua conta</h2>
        <p className="mt-0.5 text-sm text-white/50">
          {inviteCode
            ? "Você foi convidado para uma organização"
            : "Crie ou entre em uma organização"}
        </p>
      </div>
      <RegisterForm initialInviteCode={inviteCode} />
    </>
  )
}
