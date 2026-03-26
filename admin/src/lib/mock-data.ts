// ===== TYPES =====

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  website: string;
  headquarters: string;
  regions: string[];
  industrySegment: string;
  description: string;
  careersUrl: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  slug: string;
  location: string;
  remoteType: "on-site" | "remote" | "hybrid";
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  experienceLevel: "entry" | "mid" | "senior" | "executive";
  salaryRange: string;
  description: string;
  requirements: string[];
  deadline: string;
  applicationMode: "internal" | "external" | "hybrid";
  externalApplyUrl?: string;
  status: "published" | "draft" | "closed" | "archived";
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: "student" | "admin" | "super_admin";
  status: "active" | "suspended" | "deactivated";
  fullName: string;
  phone?: string;
  country: string;
  university: string;
  degree: string;
  graduationYear: number;
  profileCompletion: number;
  applicationsCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: "submitted" | "under_review" | "shortlisted" | "interview" | "rejected" | "hired";
  adminNotes?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface ContentOrder {
  id: string;
  title: string;
  orderType: "blog_post" | "job_description" | "company_profile" | "social_media" | "email_template";
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  assignedTo?: string;
  status: "pending" | "in_progress" | "review" | "completed" | "cancelled";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  adminUserId: string;
  adminName: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: string;
  createdAt: string;
}

// ===== MOCK DATA =====

export const companies: Company[] = [
  {
    id: "c1",
    name: "Schlumberger",
    slug: "schlumberger",
    logoUrl: "/logos/schlumberger.png",
    website: "https://www.slb.com",
    headquarters: "Houston, TX",
    regions: ["North America", "Middle East", "Europe"],
    industrySegment: "Oilfield Services",
    description: "World's largest oilfield services company, providing technology for reservoir characterization, drilling, production, and processing.",
    careersUrl: "https://careers.slb.com",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-06-10",
  },
  {
    id: "c2",
    name: "Halliburton",
    slug: "halliburton",
    logoUrl: "/logos/halliburton.png",
    website: "https://www.halliburton.com",
    headquarters: "Houston, TX",
    regions: ["North America", "Middle East", "Africa"],
    industrySegment: "Oilfield Services",
    description: "One of the world's largest providers of products and services to the energy industry.",
    careersUrl: "https://jobs.halliburton.com",
    status: "active",
    createdAt: "2024-01-20",
    updatedAt: "2024-07-15",
  },
  {
    id: "c3",
    name: "Baker Hughes",
    slug: "baker-hughes",
    logoUrl: "/logos/baker-hughes.png",
    website: "https://www.bakerhughes.com",
    headquarters: "Houston, TX",
    regions: ["North America", "Europe", "Asia Pacific"],
    industrySegment: "Energy Technology",
    description: "An energy technology company that provides solutions to energy and industrial customers worldwide.",
    careersUrl: "https://careers.bakerhughes.com",
    status: "active",
    createdAt: "2024-02-01",
    updatedAt: "2024-08-01",
  },
  {
    id: "c4",
    name: "TotalEnergies",
    slug: "totalenergies",
    logoUrl: "/logos/totalenergies.png",
    website: "https://www.totalenergies.com",
    headquarters: "Paris, France",
    regions: ["Europe", "Africa", "Middle East", "Asia Pacific"],
    industrySegment: "Integrated Oil & Gas",
    description: "A broad-energy company, producing and marketing fuels, natural gas and electricity.",
    careersUrl: "https://careers.totalenergies.com",
    status: "active",
    createdAt: "2024-02-10",
    updatedAt: "2024-05-20",
  },
  {
    id: "c5",
    name: "Shell",
    slug: "shell",
    logoUrl: "/logos/shell.png",
    website: "https://www.shell.com",
    headquarters: "London, UK",
    regions: ["Europe", "North America", "Asia Pacific", "Africa"],
    industrySegment: "Integrated Oil & Gas",
    description: "A global group of energy and petrochemical companies with an aim to meet the world's growing need for more and cleaner energy solutions.",
    careersUrl: "https://www.shell.com/careers",
    status: "active",
    createdAt: "2024-02-15",
    updatedAt: "2024-09-01",
  },
  {
    id: "c6",
    name: "Chevron",
    slug: "chevron",
    logoUrl: "/logos/chevron.png",
    website: "https://www.chevron.com",
    headquarters: "San Ramon, CA",
    regions: ["North America", "Asia Pacific", "Africa"],
    industrySegment: "Integrated Oil & Gas",
    description: "One of the world's leading integrated energy companies, investing in profitable, lower carbon businesses.",
    careersUrl: "https://www.chevron.com/careers",
    status: "active",
    createdAt: "2024-03-01",
    updatedAt: "2024-08-15",
  },
];

export const jobs: Job[] = [
  {
    id: "j1",
    companyId: "c1",
    companyName: "Schlumberger",
    title: "Petroleum Engineer",
    slug: "petroleum-engineer-slb",
    location: "Houston, TX",
    remoteType: "on-site",
    employmentType: "full-time",
    experienceLevel: "mid",
    salaryRange: "$95,000 - $130,000",
    description: "Join our team as a Petroleum Engineer working on reservoir simulation and optimization projects across North American operations.",
    requirements: ["BSc in Petroleum Engineering", "3-5 years experience", "Reservoir simulation software proficiency"],
    deadline: "2025-04-30",
    applicationMode: "internal",
    status: "published",
    featured: true,
    publishedAt: "2025-03-01",
    createdAt: "2025-02-28",
    updatedAt: "2025-03-01",
  },
  {
    id: "j2",
    companyId: "c2",
    companyName: "Halliburton",
    title: "Drilling Engineer Intern",
    slug: "drilling-engineer-intern",
    location: "Dubai, UAE",
    remoteType: "on-site",
    employmentType: "internship",
    experienceLevel: "entry",
    salaryRange: "$3,500/month",
    description: "Summer internship opportunity for petroleum engineering students interested in drilling and well completions.",
    requirements: ["Pursuing BSc/MSc in Petroleum or Mechanical Engineering", "Strong analytical skills", "Willing to relocate"],
    deadline: "2025-05-15",
    applicationMode: "internal",
    status: "published",
    featured: true,
    publishedAt: "2025-03-10",
    createdAt: "2025-03-08",
    updatedAt: "2025-03-10",
  },
  {
    id: "j3",
    companyId: "c3",
    companyName: "Baker Hughes",
    title: "Reservoir Simulation Analyst",
    slug: "reservoir-simulation-analyst",
    location: "London, UK",
    remoteType: "hybrid",
    employmentType: "full-time",
    experienceLevel: "senior",
    salaryRange: "£80,000 - £110,000",
    description: "Lead reservoir simulation projects using advanced modeling tools for international oil and gas clients.",
    requirements: ["MSc/PhD in Petroleum Engineering", "5+ years experience", "Eclipse/CMG proficiency"],
    deadline: "2025-06-01",
    applicationMode: "hybrid",
    status: "published",
    featured: false,
    publishedAt: "2025-03-05",
    createdAt: "2025-03-04",
    updatedAt: "2025-03-05",
  },
  {
    id: "j4",
    companyId: "c4",
    companyName: "TotalEnergies",
    title: "Production Operations Engineer",
    slug: "production-operations-engineer",
    location: "Lagos, Nigeria",
    remoteType: "on-site",
    employmentType: "full-time",
    experienceLevel: "mid",
    salaryRange: "$85,000 - $115,000",
    description: "Manage production operations for offshore assets in the Gulf of Guinea, optimizing well performance and facility throughput.",
    requirements: ["BSc in Engineering", "3+ years in production ops", "Offshore experience preferred"],
    deadline: "2025-05-30",
    applicationMode: "external",
    externalApplyUrl: "https://careers.totalenergies.com/production-ops",
    status: "published",
    featured: false,
    publishedAt: "2025-03-12",
    createdAt: "2025-03-11",
    updatedAt: "2025-03-12",
  },
  {
    id: "j5",
    companyId: "c5",
    companyName: "Shell",
    title: "Subsurface Data Scientist",
    slug: "subsurface-data-scientist",
    location: "The Hague, Netherlands",
    remoteType: "hybrid",
    employmentType: "full-time",
    experienceLevel: "senior",
    salaryRange: "€90,000 - €120,000",
    description: "Apply machine learning and advanced analytics to subsurface data for exploration and production optimization.",
    requirements: ["MSc/PhD in Geoscience or Data Science", "Python/ML experience", "Oil & gas domain knowledge"],
    deadline: "2025-07-01",
    applicationMode: "internal",
    status: "published",
    featured: true,
    publishedAt: "2025-03-15",
    createdAt: "2025-03-14",
    updatedAt: "2025-03-15",
  },
  {
    id: "j6",
    companyId: "c6",
    companyName: "Chevron",
    title: "HSE Graduate Trainee",
    slug: "hse-graduate-trainee",
    location: "Perth, Australia",
    remoteType: "on-site",
    employmentType: "full-time",
    experienceLevel: "entry",
    salaryRange: "AUD 75,000 - 90,000",
    description: "Graduate program in health, safety, and environment for recent graduates passionate about operational excellence.",
    requirements: ["Recent graduate in Engineering/Environmental Science", "Strong communication", "Safety-first mindset"],
    deadline: "2025-04-15",
    applicationMode: "internal",
    status: "published",
    featured: false,
    publishedAt: "2025-03-02",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-02",
  },
  {
    id: "j7",
    companyId: "c1",
    companyName: "Schlumberger",
    title: "Well Integrity Engineer",
    slug: "well-integrity-engineer",
    location: "Abu Dhabi, UAE",
    remoteType: "on-site",
    employmentType: "contract",
    experienceLevel: "mid",
    salaryRange: "$110,000 - $140,000",
    description: "Ensure well integrity compliance across Middle East operations.",
    requirements: ["BSc in Petroleum/Mechanical Engineering", "Well barrier knowledge", "API standards familiarity"],
    deadline: "2025-05-01",
    applicationMode: "internal",
    status: "draft",
    featured: false,
    publishedAt: "",
    createdAt: "2025-03-18",
    updatedAt: "2025-03-18",
  },
];

export const users: User[] = [
  { id: "u1", email: "sarah.chen@university.edu", role: "student", status: "active", fullName: "Sarah Chen", country: "United States", university: "Texas A&M University", degree: "MSc Petroleum Engineering", graduationYear: 2025, profileCompletion: 92, applicationsCount: 5, createdAt: "2024-09-01" },
  { id: "u2", email: "ahmed.hassan@edu.eg", role: "student", status: "active", fullName: "Ahmed Hassan", country: "Egypt", university: "Cairo University", degree: "BSc Mechanical Engineering", graduationYear: 2024, profileCompletion: 78, applicationsCount: 3, createdAt: "2024-10-15" },
  { id: "u3", email: "emma.wright@imperial.ac.uk", role: "student", status: "active", fullName: "Emma Wright", country: "United Kingdom", university: "Imperial College London", degree: "MEng Chemical Engineering", graduationYear: 2025, profileCompletion: 100, applicationsCount: 8, createdAt: "2024-08-20" },
  { id: "u4", email: "carlos.mendez@unam.mx", role: "student", status: "active", fullName: "Carlos Mendez", country: "Mexico", university: "UNAM", degree: "BSc Petroleum Engineering", graduationYear: 2026, profileCompletion: 45, applicationsCount: 1, createdAt: "2025-01-10" },
  { id: "u5", email: "fatima.al-sayed@kfupm.edu.sa", role: "student", status: "active", fullName: "Fatima Al-Sayed", country: "Saudi Arabia", university: "KFUPM", degree: "BSc Chemical Engineering", graduationYear: 2025, profileCompletion: 88, applicationsCount: 4, createdAt: "2024-11-05" },
  { id: "u6", email: "admin@petroapply.com", role: "super_admin", status: "active", fullName: "Platform Admin", country: "United States", university: "-", degree: "-", graduationYear: 0, profileCompletion: 100, applicationsCount: 0, createdAt: "2024-01-01" },
  { id: "u7", email: "james.okonkwo@unilag.edu.ng", role: "student", status: "suspended", fullName: "James Okonkwo", country: "Nigeria", university: "University of Lagos", degree: "BSc Petroleum Engineering", graduationYear: 2024, profileCompletion: 60, applicationsCount: 2, createdAt: "2024-12-01" },
];

export const applications: Application[] = [
  { id: "a1", userId: "u1", userName: "Sarah Chen", userEmail: "sarah.chen@university.edu", jobId: "j1", jobTitle: "Petroleum Engineer", companyName: "Schlumberger", resumeUrl: "/resumes/sarah-chen.pdf", status: "under_review", appliedAt: "2025-03-05", updatedAt: "2025-03-10" },
  { id: "a2", userId: "u3", userName: "Emma Wright", userEmail: "emma.wright@imperial.ac.uk", jobId: "j3", jobTitle: "Reservoir Simulation Analyst", companyName: "Baker Hughes", coverLetter: "I am passionate about reservoir modeling...", resumeUrl: "/resumes/emma-wright.pdf", status: "shortlisted", appliedAt: "2025-03-08", updatedAt: "2025-03-14" },
  { id: "a3", userId: "u2", userName: "Ahmed Hassan", userEmail: "ahmed.hassan@edu.eg", jobId: "j2", jobTitle: "Drilling Engineer Intern", companyName: "Halliburton", resumeUrl: "/resumes/ahmed-hassan.pdf", status: "submitted", appliedAt: "2025-03-12", updatedAt: "2025-03-12" },
  { id: "a4", userId: "u5", userName: "Fatima Al-Sayed", userEmail: "fatima.al-sayed@kfupm.edu.sa", jobId: "j5", jobTitle: "Subsurface Data Scientist", companyName: "Shell", resumeUrl: "/resumes/fatima-alsayed.pdf", status: "interview", appliedAt: "2025-03-16", updatedAt: "2025-03-20" },
  { id: "a5", userId: "u1", userName: "Sarah Chen", userEmail: "sarah.chen@university.edu", jobId: "j5", jobTitle: "Subsurface Data Scientist", companyName: "Shell", resumeUrl: "/resumes/sarah-chen.pdf", status: "rejected", adminNotes: "Strong profile but lacks ML experience", appliedAt: "2025-03-17", updatedAt: "2025-03-22" },
  { id: "a6", userId: "u3", userName: "Emma Wright", userEmail: "emma.wright@imperial.ac.uk", jobId: "j1", jobTitle: "Petroleum Engineer", companyName: "Schlumberger", resumeUrl: "/resumes/emma-wright.pdf", status: "hired", adminNotes: "Excellent candidate, offered position", appliedAt: "2025-02-20", updatedAt: "2025-03-15" },
  { id: "a7", userId: "u4", userName: "Carlos Mendez", userEmail: "carlos.mendez@unam.mx", jobId: "j6", jobTitle: "HSE Graduate Trainee", companyName: "Chevron", resumeUrl: "/resumes/carlos-mendez.pdf", status: "submitted", appliedAt: "2025-03-19", updatedAt: "2025-03-19" },
];

export const contentOrders: ContentOrder[] = [
  { id: "co1", title: "Schlumberger Company Profile Update", orderType: "company_profile", description: "Update the company profile page for Schlumberger with latest Q4 results and new technology announcements.", priority: "high", dueDate: "2025-04-01", assignedTo: "Content Team", status: "in_progress", createdBy: "Admin", createdAt: "2025-03-10", updatedAt: "2025-03-15" },
  { id: "co2", title: "Weekly Job Market Blog Post", orderType: "blog_post", description: "Write a blog post about the latest petroleum job market trends for March 2025.", priority: "medium", dueDate: "2025-03-28", assignedTo: "Marketing", status: "pending", createdBy: "Admin", createdAt: "2025-03-18", updatedAt: "2025-03-18" },
  { id: "co3", title: "Baker Hughes Career Fair Social Media", orderType: "social_media", description: "Create social media content promoting Baker Hughes career fair event.", priority: "urgent", dueDate: "2025-03-25", assignedTo: "Social Media Team", status: "review", createdBy: "Admin", createdAt: "2025-03-12", updatedAt: "2025-03-20" },
  { id: "co4", title: "New Job Template - Senior Roles", orderType: "job_description", description: "Create a standardized job description template for senior-level positions.", priority: "low", dueDate: "2025-04-15", status: "pending", createdBy: "Admin", createdAt: "2025-03-20", updatedAt: "2025-03-20" },
];

export const activityLogs: ActivityLog[] = [
  { id: "al1", adminUserId: "u6", adminName: "Platform Admin", action: "Created company", entityType: "company", entityId: "c6", metadata: "Chevron added to platform", createdAt: "2025-03-20T10:30:00" },
  { id: "al2", adminUserId: "u6", adminName: "Platform Admin", action: "Published job", entityType: "job", entityId: "j5", metadata: "Subsurface Data Scientist at Shell", createdAt: "2025-03-19T14:15:00" },
  { id: "al3", adminUserId: "u6", adminName: "Platform Admin", action: "Updated application status", entityType: "application", entityId: "a6", metadata: "Emma Wright status changed to Hired", createdAt: "2025-03-18T09:45:00" },
  { id: "al4", adminUserId: "u6", adminName: "Platform Admin", action: "Suspended user", entityType: "user", entityId: "u7", metadata: "James Okonkwo suspended for policy violation", createdAt: "2025-03-17T16:00:00" },
  { id: "al5", adminUserId: "u6", adminName: "Platform Admin", action: "Created content order", entityType: "content_order", entityId: "co1", metadata: "Schlumberger profile update assigned", createdAt: "2025-03-16T11:20:00" },
  { id: "al6", adminUserId: "u6", adminName: "Platform Admin", action: "Updated settings", entityType: "settings", entityId: "general", metadata: "Updated platform branding colors", createdAt: "2025-03-15T08:30:00" },
];

// ===== DASHBOARD STATS =====

export const dashboardStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalCompanies: 38,
  totalJobs: 156,
  totalApplications: 3421,
  pendingContentOrders: 6,
  monthlyGrowth: {
    users: 12.5,
    applications: 18.3,
    jobs: 8.7,
  },
  applicationsByStatus: {
    submitted: 420,
    under_review: 312,
    shortlisted: 145,
    interview: 89,
    rejected: 198,
    hired: 67,
  },
  recentMonthlyApplications: [
    { month: "Oct", count: 245 },
    { month: "Nov", count: 310 },
    { month: "Dec", count: 278 },
    { month: "Jan", count: 356 },
    { month: "Feb", count: 402 },
    { month: "Mar", count: 389 },
  ],
};
