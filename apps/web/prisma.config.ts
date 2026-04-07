import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: "file:./prisma/data/shinobiops.db",
  },
})
