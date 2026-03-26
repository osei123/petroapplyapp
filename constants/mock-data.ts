// Mobile mock data

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  headquarters: string;
  industrySegment: string;
  description: string;
  website: string;
  jobCount: number;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  location: string;
  remoteType: 'on-site' | 'remote' | 'hybrid';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior';
  salaryRange: string;
  description: string;
  requirements: string[];
  deadline: string;
  applicationMode: 'internal' | 'external' | 'hybrid';
  featured: boolean;
  postedAt: string;
  applicantCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  appliedAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  job: Job;
  savedAt: string;
}

export const currentUser = {
  id: 'u1',
  fullName: 'Sarah Chen',
  email: 'sarah.chen@university.edu',
  phone: '+1 555 0123',
  country: 'United States',
  university: 'Texas A&M University',
  degree: 'MSc Petroleum Engineering',
  graduationYear: 2025,
  bio: 'Passionate petroleum engineering student with research experience in reservoir simulation and enhanced oil recovery.',
  skills: ['Reservoir Simulation', 'Python', 'MATLAB', 'Eclipse', 'Data Analysis', 'Well Testing'],
  preferredRoles: ['Petroleum Engineer', 'Reservoir Engineer', 'Data Scientist'],
  preferredLocations: ['Houston, TX', 'Dubai, UAE', 'London, UK'],
  linkedinUrl: 'https://linkedin.com/in/sarachen',
  profileCompletion: 88,
};

export const companies: Company[] = [
  { id: 'c1', name: 'Schlumberger', logoUrl: '', headquarters: 'Houston, TX', industrySegment: 'Oilfield Services', description: "World's largest oilfield services company.", website: 'https://slb.com', jobCount: 12 },
  { id: 'c2', name: 'Halliburton', logoUrl: '', headquarters: 'Houston, TX', industrySegment: 'Oilfield Services', description: 'Leading provider of products and services to the energy industry.', website: 'https://halliburton.com', jobCount: 8 },
  { id: 'c3', name: 'Baker Hughes', logoUrl: '', headquarters: 'Houston, TX', industrySegment: 'Energy Technology', description: 'Energy technology company providing solutions worldwide.', website: 'https://bakerhughes.com', jobCount: 6 },
  { id: 'c4', name: 'TotalEnergies', logoUrl: '', headquarters: 'Paris, France', industrySegment: 'Integrated Oil & Gas', description: 'Broad energy company producing fuels, gas, and electricity.', website: 'https://totalenergies.com', jobCount: 9 },
  { id: 'c5', name: 'Shell', logoUrl: '', headquarters: 'London, UK', industrySegment: 'Integrated Oil & Gas', description: 'Global energy and petrochemical company.', website: 'https://shell.com', jobCount: 15 },
  { id: 'c6', name: 'Chevron', logoUrl: '', headquarters: 'San Ramon, CA', industrySegment: 'Integrated Oil & Gas', description: 'Leading integrated energy company.', website: 'https://chevron.com', jobCount: 7 },
];

export const jobs: Job[] = [
  { id: 'j1', companyId: 'c1', companyName: 'Schlumberger', title: 'Petroleum Engineer', location: 'Houston, TX', remoteType: 'on-site', employmentType: 'full-time', experienceLevel: 'mid', salaryRange: '$95K - $130K', description: 'Join our team as a Petroleum Engineer working on reservoir simulation and optimization projects across North American operations.', requirements: ['BSc in Petroleum Engineering', '3-5 years experience', 'Reservoir simulation proficiency'], deadline: '2025-04-30', applicationMode: 'internal', featured: true, postedAt: '2 days ago', applicantCount: 388 },
  { id: 'j2', companyId: 'c2', companyName: 'Halliburton', title: 'Drilling Engineer Intern', location: 'Dubai, UAE', remoteType: 'on-site', employmentType: 'internship', experienceLevel: 'entry', salaryRange: '$3,500/mo', description: 'Summer internship for petroleum engineering students in drilling and well completions.', requirements: ['Pursuing BSc/MSc in Petroleum Engineering', 'Strong analytical skills'], deadline: '2025-05-15', applicationMode: 'internal', featured: true, postedAt: '5 days ago', applicantCount: 245 },
  { id: 'j3', companyId: 'c3', companyName: 'Baker Hughes', title: 'Reservoir Simulation Analyst', location: 'London, UK', remoteType: 'hybrid', employmentType: 'full-time', experienceLevel: 'senior', salaryRange: '£80K - £110K', description: 'Lead reservoir simulation projects using advanced modeling tools.', requirements: ['MSc/PhD in Petroleum Engineering', '5+ years experience', 'Eclipse/CMG proficiency'], deadline: '2025-06-01', applicationMode: 'hybrid', featured: false, postedAt: '1 week ago', applicantCount: 156 },
  { id: 'j4', companyId: 'c4', companyName: 'TotalEnergies', title: 'Production Operations Engineer', location: 'Lagos, Nigeria', remoteType: 'on-site', employmentType: 'full-time', experienceLevel: 'mid', salaryRange: '$85K - $115K', description: 'Manage production operations for offshore assets in the Gulf of Guinea.', requirements: ['BSc in Engineering', '3+ years in production ops'], deadline: '2025-05-30', applicationMode: 'external', featured: false, postedAt: '3 days ago', applicantCount: 89 },
  { id: 'j5', companyId: 'c5', companyName: 'Shell', title: 'Subsurface Data Scientist', location: 'The Hague, Netherlands', remoteType: 'hybrid', employmentType: 'full-time', experienceLevel: 'senior', salaryRange: '€90K - €120K', description: 'Apply ML and advanced analytics to subsurface data for exploration optimization.', requirements: ['MSc/PhD in Geoscience or Data Science', 'Python/ML experience'], deadline: '2025-07-01', applicationMode: 'internal', featured: true, postedAt: '1 day ago', applicantCount: 312 },
  { id: 'j6', companyId: 'c6', companyName: 'Chevron', title: 'HSE Graduate Trainee', location: 'Perth, Australia', remoteType: 'on-site', employmentType: 'full-time', experienceLevel: 'entry', salaryRange: 'AUD 75K - 90K', description: 'Graduate program in health, safety, and environment.', requirements: ['Recent graduate in Engineering', 'Strong communication'], deadline: '2025-04-15', applicationMode: 'internal', featured: false, postedAt: '4 days ago', applicantCount: 198 },
];

export const applications: Application[] = [
  { id: 'a1', jobId: 'j1', jobTitle: 'Petroleum Engineer', companyName: 'Schlumberger', status: 'under_review', appliedAt: '2025-03-05', updatedAt: '2025-03-10' },
  { id: 'a2', jobId: 'j3', jobTitle: 'Reservoir Simulation Analyst', companyName: 'Baker Hughes', status: 'shortlisted', appliedAt: '2025-03-08', updatedAt: '2025-03-14' },
  { id: 'a3', jobId: 'j5', jobTitle: 'Subsurface Data Scientist', companyName: 'Shell', status: 'interview', appliedAt: '2025-03-16', updatedAt: '2025-03-20' },
  { id: 'a4', jobId: 'j2', jobTitle: 'Drilling Engineer Intern', companyName: 'Halliburton', status: 'submitted', appliedAt: '2025-03-19', updatedAt: '2025-03-19' },
  { id: 'a5', jobId: 'j6', jobTitle: 'HSE Graduate Trainee', companyName: 'Chevron', status: 'rejected', appliedAt: '2025-02-20', updatedAt: '2025-03-15' },
];

export const savedJobs: SavedJob[] = [
  { id: 's1', job: jobs[0], savedAt: '2025-03-18' },
  { id: 's2', job: jobs[4], savedAt: '2025-03-20' },
  { id: 's3', job: jobs[1], savedAt: '2025-03-21' },
];
