import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./schema.ts",
    dialect: 'sqlite',
    dbCredentials: "./sqlite.db",
    url: "./sqlite.db",
    verbose: true,
})
