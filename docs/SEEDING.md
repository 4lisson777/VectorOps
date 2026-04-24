# Seeding de Desenvolvimento

O ShinobiOps possui um script (`seed.ts`) para popular rapidamente o banco de dados SQLite com usuários e configurações iniciais necessários em ambientes locais.

## 1. Funcionamento do Script
- **Local:** `apps/web/prisma/seed.ts`.
- **Criação de Usuários:** O script cria 4 usuários por padrão.
- **Segurança:** O script utiliza `upsert` com base no e-mail, garantindo que usuários existentes não sejam duplicados se rodado novamente. Ele também utiliza `bcrypt` (12 rounds) para os hashes de senha.

## 2. Como Executar (Comando)
A execução deve ocorrer dentro da pasta `apps/web`:
```bash
# Na raiz do projeto:
npm run db:seed --workspace=web

# Dentro de apps/web:
npm run db:seed
```

## 3. Credenciais Padrão (Ambiente Local)
Todos os usuários utilizam a senha: **`Password123!`**

| Nome | E-mail | Role | Ninja Alias |
| :--- | :--- | :--- | :--- |
| Yuki Tanaka | `techlead@vectorops.dev` | `TECH_LEAD` | IronJonin |
| Ryu Hayabusa | `developer@vectorops.dev` | `DEVELOPER` | SilentBlade |
| Mei Lin | `supportlead@vectorops.dev` | `SUPPORT_LEAD` | SwiftCrane |
| Kenji Mori | `support@vectorops.dev` | `SUPPORT_MEMBER` | GhostFox |

## 4. Configurações Iniciais
Além de usuários, o script aplica `PRAGMAs` fundamentais do SQLite:
- **Journal Mode:** `WAL`.
- **Foreign Keys:** `ON`.
- **Synchronous:** `NORMAL`.
- **Busy Timeout:** `5000ms`.

---

*Aviso: O banco de dados SQLite (`sqlite.db`) é local. Em caso de corrupção ou necessidade de reset, apague o arquivo e execute o comando acima para restaurar os usuários base.*
