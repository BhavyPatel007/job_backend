import type { Express, Request,NextFunction  } from "express";
import { createServer, type Server } from "http";
import { supabase } from "./index.js";
import {
  insertJobApplicationSchema,
  insertContactMessageSchema,
} from "../shared/schema.js";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

// Configure multer for temporary uploads
const uploadDir = path.join(process.cwd(), "tmp_uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, DOCX, and images are allowed."
        )
      );
  },
});

// Helper: Upload file to Supabase Storage
async function uploadFileToSupabase(file: Express.Multer.File) {
  const fileData = fs.readFileSync(file.path);
  const filePath = `uploads/${Date.now()}_${file.originalname}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, fileData);
  if (error) throw error;

  fs.unlinkSync(file.path); // remove local temp file

  const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
  return data;
}

// Register all routes
export async function registerRoutes(app: Express): Promise<Server> {

  // ----- Jobs -----
  app.get("/api/jobs", async (req, res) => {
    try {
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/featured", async (req, res) => {
    try {
      const { data, error } = await supabase.from("jobs").select("*").limit(6);
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch featured jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", req.params.id)
        .single();
      if (error || !data)
        return res.status(404).json({ error: "Job not found" });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // ----- Job Applications -----
  app.post(
    "/api/jobs/:jobId/apply",
    upload.fields([
      { name: "resume", maxCount: 1 },
      { name: "coverLetter", maxCount: 1 },
      { name: "additionalFiles", maxCount: 5 },
    ]),
    async (req, res) => {
      try {
        const jobId = req.params.jobId;

        // Verify job exists
        const { data: job, error: jobError } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();
        if (jobError || !job)
          return res.status(404).json({ error: "Job not found" });

        const files = req.files as
          | { [fieldname: string]: Express.Multer.File[] }
          | undefined;

        const resumeUrl = files?.resume?.[0]
          ? await uploadFileToSupabase(files.resume[0])
          : undefined;
        const coverLetterUrl = files?.coverLetter?.[0]
          ? await uploadFileToSupabase(files.coverLetter[0])
          : undefined;
        const additionalFiles = [];

        if (files?.additionalFiles) {
          for (const f of files.additionalFiles) {
            additionalFiles.push(await uploadFileToSupabase(f));
          }
        }

        const applicationData = {
          ...req.body,
          job_id: jobId,
          resume_url: resumeUrl,
          cover_letter_url: coverLetterUrl,
          additional_files: additionalFiles,
        };

        const validatedData = insertJobApplicationSchema.parse(applicationData);

        const { data: application, error } = await supabase
          .from("job_applications")
          .insert([validatedData])
          .select()
          .single();

        if (error) throw error;
        res.status(201).json(application);
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to create job application" });
      }
    }
  );

  // ----- Blog -----
  app.get("/api/blog", async (_req, res) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .limit(20);
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", req.params.slug)
        .single();
      if (error || !data)
        return res.status(404).json({ error: "Blog post not found" });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // ----- Companies -----
  app.get("/api/companies", async (_req, res) => {
    try {
      const { data, error } = await supabase.from("companies").select("*");
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  // ----- Contact -----
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([validatedData])
        .select()
        .single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to send message" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
