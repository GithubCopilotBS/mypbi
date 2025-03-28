import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't need any database tables for this application as it's client-side only
// The storage is handled in-memory with the CSV data

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define CSV-related types
export interface CSVField {
  name: string;
  type: 'dimension' | 'measure' | 'date';
  index: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'doughnut' | 'polarArea' | 'radar' | 'bubble';
  xAxis?: CSVField;
  yAxis?: CSVField;
  colorBy?: CSVField;
  filters?: CSVField[];
  showLegend: boolean;
  showDataLabels: boolean;
  showGridLines: boolean;
  colorScheme: string;
  // Advanced customization options
  axisTitle?: string;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  beginAtZero?: boolean;
  stacked?: boolean;
  fontSize?: number;
  aspectRatio?: number;
}
