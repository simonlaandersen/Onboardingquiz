import { type User, type InsertUser, type Config, type InsertConfig } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { users as usersTable, config as configTable } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getConfig(): Promise<Config | undefined>;
  updateConfig(data: InsertConfig): Promise<Config>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({ where: eq(usersTable.id, id) });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({ where: eq(usersTable.username, username) });
    return result;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [result] = await db.insert(usersTable).values(insertUser).returning();
    return result;
  }

  async getConfig(): Promise<Config | undefined> {
    let result = await db.query.config.findFirst({ where: eq(configTable.id, "default") });
    
    if (!result) {
      const defaultConfig = {
        primaryColor: "#2F80ED",
        secondaryColor: "#0B1E3D",
        title: "Er jeres onboarding gearet til fremtiden?",
        subtitle: "HR Maturity Tools",
        description: "Tag vores 2-minutters maturity check og få en dybdegående analyse af jeres styrker og potentialer.",
        buttonText: "Start testen nu",
        questionsData: [],
        resultsData: [],
      };
      
      const [newConfig] = await db.insert(configTable).values({ id: "default", ...defaultConfig }).returning();
      result = newConfig;
    }
    
    return result;
  }

  async updateConfig(data: InsertConfig): Promise<Config> {
    const [result] = await db.update(configTable).set(data).where(eq(configTable.id, "default")).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
