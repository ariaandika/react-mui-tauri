import Elysia, { t } from "elysia"
import cors from "@elysiajs/cors"
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { and, eq, isNull } from "drizzle-orm";
import { users, tickets } from "./schema"

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite, { schema: { users, tickets } });

const app = new Elysia()
.onRequest(({ request }) => console.log(request.method.toUpperCase(), new URL(request.url).pathname))

.onError(({ error }) => {
    console.error(error);
    return new Response(void 0, { status: 500 })
})

.use(cors())

.get("/", async () => {
    return await db.query.tickets.findMany({ where: isNull(tickets.owner) });
})

.get("/tickets/:name", async ({ params: { name } }) => {
    return await db.query.tickets.findMany({
        where: eq(tickets.owner, name),
    })
},{
    params: t.Object({ name: t.String() })
})

.post("/login", async ({ body: { name, password } }) => {
    await Bun.sleep(600)
    return await db.query.users.findFirst({
        where: and(eq(users.name, name),eq(users.password, password)),
    })
},{
    body: t.Object({ name: t.String(), password: t.String() })
})

.post("/buy", async ({ body: { ticket_id, user } }) => {
    const d = new Date();
    await db.update(tickets).set({
        owner: user,
        buyed_at: `${d.toLocaleDateString()} ${d.toLocaleTimeString().slice(0,-3)}`
    })
    .where(eq(tickets.id, ticket_id))

},{
    body: t.Object({
        ticket_id: t.Number(),
        user: t.String(),
    })
})


app.listen(3000, () => console.log("Listening in", app.server?.url.href))


export type App = typeof app;
export type Users = typeof users.$inferSelect;
export type Tickets = typeof tickets.$inferSelect;

