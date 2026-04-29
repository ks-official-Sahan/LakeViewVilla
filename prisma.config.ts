import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  datasource: {
    // Use process.env to avoid crash when DATABASE_URL is not set
    // (e.g., during `prisma generate` in CI without DB access)
    url: process.env.DATABASE_URL!,
  },
});
