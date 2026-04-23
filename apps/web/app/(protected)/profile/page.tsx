import { ProfileForm } from "@/components/profile/profile-form"

export const metadata = {
  title: "Perfil — VectorOps",
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configurações de Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Atualize seu nome, apelido e preferências
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}
