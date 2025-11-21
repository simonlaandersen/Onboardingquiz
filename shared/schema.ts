import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const config = pgTable("config", {
  id: varchar("id").primaryKey().default("default"),
  primaryColor: varchar("primary_color").default("#2F80ED"),
  secondaryColor: varchar("secondary_color").default("#0B1E3D"),
  title: text("title").default("Er jeres onboarding gearet til fremtiden?"),
  subtitle: text("subtitle").default("HR Maturity Tools"),
  description: text("description").default("Tag vores 2-minutters maturity check og få en dybdegående analyse af jeres styrker og potentialer."),
  buttonText: varchar("button_text").default("Start testen nu"),
  questionsData: jsonb("questions_data").$type<any>().default([]),
  resultsData: jsonb("results_data").$type<any>().default([]),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConfigSchema = createInsertSchema(config).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Config = typeof config.$inferSelect;
export type InsertConfig = z.infer<typeof insertConfigSchema>;
