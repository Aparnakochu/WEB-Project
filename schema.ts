import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  signupDate: timestamp("signup_date").defaultNow().notNull()
});

export const insertWaitlistSchema = createInsertSchema(waitlist)
  .pick({
    email: true,
    name: true,
  })
  .extend({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
  });

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  experience: text("experience").notNull(),
  description: text("description"),
  applicationLink: text("application_link").notNull(),
  salary: text("salary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  crawledFrom: text("crawled_from").notNull(),
  externalId: text("external_id").notNull(),
});

export const insertJobSchema = createInsertSchema(jobs)
  .pick({
    title: true,
    company: true,
    location: true,
    experience: true,
    description: true,
    applicationLink: true,
    salary: true,
    crawledFrom: true,
    externalId: true,
  })
  .extend({
    title: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company name is required"),
    location: z.string().min(1, "Location is required"),
    experience: z.string().min(1, "Experience requirement is required"),
    description: z.string().optional(),
    applicationLink: z.string().url("Invalid application URL"),
    salary: z.string().optional(),
    crawledFrom: z.string().min(1, "Source platform is required"),
    externalId: z.string().min(1, "External ID is required"),
  });

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;