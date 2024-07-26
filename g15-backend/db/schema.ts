import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  todoHeader: varchar("todo_header", { length: 255}).notNull(),
  todoText: varchar("todo_text", { length: 255 }).notNull(),
  isDone: boolean("is_done").default(false),
  priority: varchar("priority", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});
