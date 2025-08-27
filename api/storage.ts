import { 
  companies, 
  jobs, 
  jobApplications, 
  blogPosts, 
  contactMessages,
  type Company, 
  type InsertCompany,
  type Job, 
  type InsertJob,
  type JobApplication, 
  type InsertJobApplication,
  type BlogPost, 
  type InsertBlogPost,
  type ContactMessage, 
  type InsertContactMessage,
  type JobWithCompany,
  type User,
  type InsertUser,
  users
} from "@shared/schema";
import { supabase } from "./db";
import { eq, desc, and, ilike, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Company methods
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;

  // Job methods
  getJobs(filters?: {
    search?: string;
    location?: string;
    type?: string;
    experienceLevel?: string;
    salaryMin?: number;
    salaryMax?: number;
    limit?: number;
    offset?: number;
  }): Promise<JobWithCompany[]>;
  getJob(id: string): Promise<JobWithCompany | undefined>;
  getFeaturedJobs(limit?: number): Promise<JobWithCompany[]>;
  createJob(job: InsertJob): Promise<Job>;

  // Job application methods
  getJobApplications(jobId?: string): Promise<JobApplication[]>;
  getJobApplication(id: string): Promise<JobApplication | undefined>;
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;

  // Blog methods
  getBlogPosts(limit?: number, offset?: number): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;

  // Contact methods
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class DatabaseStorage {
  // ----------------- Users -----------------
  async getUser(id: string): Promise<User | undefined> {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("getUser error:", error);
      return undefined;
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();
    if (error) {
      console.error("getUserByUsername error:", error);
      return undefined;
    }
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User | undefined> {
    const { data: user, error } = await supabase
      .from("users")
      .insert([insertUser])
      .select()
      .single();
    if (error) {
      console.error("createUser error:", error);
      return undefined;
    }
    return user;
  }

  // ----------------- Companies -----------------
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("createdAt", { ascending: false });
    if (error) {
      console.error("getCompanies error:", error);
      return [];
    }
    return data || [];
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("getCompany error:", error);
      return undefined;
    }
    return data;
  }

  async createCompany(company: InsertCompany): Promise<Company | undefined> {
    const { data, error } = await supabase
      .from("companies")
      .insert([company])
      .select()
      .single();
    if (error) {
      console.error("createCompany error:", error);
      return undefined;
    }
    return data;
  }

  // ----------------- Jobs -----------------
  async getJobs(filters?: {
    search?: string;
    location?: string;
    type?: string;
    experienceLevel?: string;
    salaryMin?: number;
    salaryMax?: number;
    limit?: number;
    offset?: number;
  }): Promise<JobWithCompany[]> {
    let query = supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("isActive", true);

    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
    if (filters?.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }
    if (filters?.type) {
      query = query.eq("type", filters.type);
    }
    if (filters?.experienceLevel) {
      query = query.eq("experienceLevel", filters.experienceLevel);
    }
    if (filters?.salaryMin) {
      query = query.gte("salaryMin", filters.salaryMin);
    }
    if (filters?.salaryMax) {
      query = query.lte("salaryMax", filters.salaryMax);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const { data, error } = await query.order("postedAt", { ascending: false });
    if (error) {
      console.error("getJobs error:", error);
      return [];
    }

    return (data as JobWithCompany[]) || [];
  }

  async getJob(id: string): Promise<JobWithCompany | undefined> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("id", id)
      .eq("isActive", true)
      .single();
    if (error) {
      console.error("getJob error:", error);
      return undefined;
    }
    return data as JobWithCompany;
  }

  async getFeaturedJobs(limit = 6): Promise<JobWithCompany[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*, company:companies(*)")
      .eq("isActive", true)
      .order("postedAt", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("getFeaturedJobs error:", error);
      return [];
    }
    return data as JobWithCompany[];
  }

  async createJob(job: InsertJob): Promise<Job | undefined> {
    const { data, error } = await supabase
      .from("jobs")
      .insert([job])
      .select()
      .single();
    if (error) {
      console.error("createJob error:", error);
      return undefined;
    }
    return data;
  }

  // ----------------- Job Applications -----------------
  async getJobApplications(jobId?: string): Promise<JobApplication[]> {
    let query = supabase.from("jobApplications").select("*");
    if (jobId) query = query.eq("jobId", jobId);
    const { data, error } = await query.order("appliedAt", { ascending: false });
    if (error) {
      console.error("getJobApplications error:", error);
      return [];
    }
    return data || [];
  }

  async getJobApplication(id: string): Promise<JobApplication | undefined> {
    const { data, error } = await supabase
      .from("jobApplications")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("getJobApplication error:", error);
      return undefined;
    }
    return data;
  }

  async createJobApplication(application: InsertJobApplication): Promise<JobApplication | undefined> {
    const { data, error } = await supabase
      .from("jobApplications")
      .insert([application])
      .select()
      .single();
    if (error) {
      console.error("createJobApplication error:", error);
      return undefined;
    }
    return data;
  }

  // ----------------- Blog -----------------
  async getBlogPosts(limit = 20, offset = 0): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from("blogPosts")
      .select("*")
      .eq("isPublished", true)
      .order("publishedAt", { ascending: false })
      .limit(limit)
      .offset(offset);
    if (error) {
      console.error("getBlogPosts error:", error);
      return [];
    }
    return data || [];
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from("blogPosts")
      .select("*")
      .eq("id", id)
      .eq("isPublished", true)
      .single();
    if (error) {
      console.error("getBlogPost error:", error);
      return undefined;
    }
    return data;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from("blogPosts")
      .select("*")
      .eq("slug", slug)
      .eq("isPublished", true)
      .single();
    if (error) {
      console.error("getBlogPostBySlug error:", error);
      return undefined;
    }
    return data;
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from("blogPosts")
      .insert([blogPost])
      .select()
      .single();
    if (error) {
      console.error("createBlogPost error:", error);
      return undefined;
    }
    return data;
  }

  // ----------------- Contact -----------------
  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from("contactMessages")
      .select("*")
      .order("createdAt", { ascending: false });
    if (error) {
      console.error("getContactMessages error:", error);
      return [];
    }
    return data || [];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage | undefined> {
    const { data, error } = await supabase
      .from("contactMessages")
      .insert([message])
      .select()
      .single();
    if (error) {
      console.error("createContactMessage error:", error);
      return undefined;
    }
    return data;
  }
}

export const storage = new DatabaseStorage();
