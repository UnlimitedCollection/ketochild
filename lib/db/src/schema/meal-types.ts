import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const mealTypesTable = pgTable("meal_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MealType = typeof mealTypesTable.$inferSelect;
export type InsertMealType = typeof mealTypesTable.$inferInsert;
