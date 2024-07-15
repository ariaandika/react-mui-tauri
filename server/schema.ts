import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    id: integer('id').notNull(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    created_at: text("created_at").notNull(),
});

export const tickets = sqliteTable('tickets', {
    id: integer('id').notNull(),
    name: text('name').unique().notNull(),
    studio: text('studio').notNull(),
    owner: text('owner'),
    img: text('img').notNull(),
    time: text("time").notNull(),
    price: integer("price").notNull(),
    buyed_at: text("buyed_at").notNull(),
})


