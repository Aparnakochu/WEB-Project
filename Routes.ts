import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertJobSchema } from "@shared/schema";
import { ZodError } from "zod";
import { jobCrawler } from "./crawler";

export async function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const data = insertWaitlistSchema.parse(req.body);
      const isRegistered = await storage.isEmailRegistered(data.email);
      if (isRegistered) {
        return res.status(400).json({ 
          message: "This email is already registered for the waitlist" 
        });
      }
      const entry = await storage.addToWaitlist(data);
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ 
          message: err.errors[0].message 
        });
      }
      throw err;
    }
  });

  // Get jobs with filtering and pagination
  app.get("/api/jobs", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        location: req.query.location as string | undefined,
        experience: req.query.experience as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const { jobs, total } = await storage.getJobs(filters);
      res.json({ jobs, total });
    } catch (err) {
      console.error('Error fetching jobs:', err);
      throw err;
    }
  });

  // Add a new job
  app.post("/api/jobs", async (req, res) => {
    try {
      const data = insertJobSchema.parse(req.body);

      // Check if job already exists
      const existingJob = await storage.getJobByExternalId(data.externalId);
      if (existingJob) {
        return res.status(400).json({ 
          message: "This job already exists in our database" 
        });
      }

      const job = await storage.addJob(data);
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ 
          message: err.errors[0].message 
        });
      }
      throw err;
    }
  });

  // Trigger job crawling
  app.post("/api/jobs/crawl", async (req, res) => {
    try {
      if (!jobCrawler.shouldCrawl()) {
        return res.status(429).json({
          message: "Jobs were recently crawled. Please wait 24 hours between crawls."
        });
      }

      const keyword = req.query.keyword as string || "Product Manager";
      await jobCrawler.crawlLinkedInJobs(keyword);
      res.status(200).json({ message: "Jobs crawled successfully" });
    } catch (err) {
      console.error('Error crawling jobs:', err);
      throw err;
    }
  });

  return createServer(app);
}