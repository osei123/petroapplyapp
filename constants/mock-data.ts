// Mobile App Mock Data

export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  headquarters: string;
  industrySegment: string;
  description: string;
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
  experienceLevel: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  deadline: string;
  applicationMode: 'internal' | 'external' | 'hybrid';
  featured: boolean;
  postedDate: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  appliedAt: string;
}

export interface SavedJob {
  id: string;
  job: Job;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  university: string;
  degree: string;
  graduationYear: number;
  bio: string;
  skills: string[];
  linkedinUrl: string;
  profileCompletion: number;
  avatarInitials: string;
}

export const currentUser: UserProfile = {
  id: 'u1',
  fullName: 'Sarah Chen',
  email: 'sarah.chen@university.edu',
  phone: '+1 (555) 234-5678',
  country: 'United States',
  university: 'Texas A&M University',
  degree: 'MSc Petroleum Engineering',
  graduationYear: 2025,
  bio: 'Passionate petroleum engineering student with research experience in reservoir simulation and EOR techniques.',
  skills: ['Reservoir Simulation', 'Eclipse', 'Python', 'MATLAB', 'Data Analysis', 'Well Testing'],
  linkedinUrl: 'https://linkedin.com/in/sarah-chen',
  profileCompletion: 92,
  avatarInitials: 'SC',
};

export const companies: Company[] = [
  { id: 'c1', name: 'Schlumberger', logoUrl: '', headquarters: 'Houston, TX', industrySegment: 'Oilfield Services', description: 'World\'s largest oilfield services company.', jobCount: 12 },
  { id: 'c2', name: 'Halliburton', logoUrl: '', headquarters: 'Houston, TX', industrySegment: 'Oilfield Services', description: 'One of the world\'s largest providers of products and services to the energy industry.', jobCount: 8 },
  { id: 'c3', name: 'Baker Hughes', logoUrl: '', headquarters: 'Houston, TX', industrySegment: 'Energy Technology', description: 'An energy technology company providing solutions worldwide.', jobCount: 6 },
  { id: 'c4', name: 'TotalEnergies', logoUrl: '', headquarters: 'Paris, France', industrySegment: 'Integrated Oil & Gas', description: 'A broad-energy company, producing fuels, natural gas and electricity.', jobCount: 10 },
  { id: 'c5', name: 'Shell', logoUrl: '', headquarters: 'London, UK', industrySegment: 'Integrated Oil & Gas', description: 'A global energy and petrochemical company.', jobCount: 15 },
  { id: 'c6', name: 'Chevron', logoUrl: '', headquarters: 'San Ramon, CA', industrySegment: 'Integrated Oil & Gas', description: 'One of the world\'s leading integrated energy companies.', jobCount: 9 },
];

export const jobs: Job[] = [
  { id: 'j1', companyId: 'c1', companyName: 'Schlumberger', title: 'Petroleum Engineer', location: 'Houston, TX', remoteType: 'on-site', employmentType: 'full-time', experienceLevel: 'Mid Level', salaryRange: '$95K - $130K', description: 'Join our team as a Petroleum Engineer working on reservoir simulation and optimization projects across North American operations.', requirements: ['BSc in Petroleum Engineering', '3-5 years experience', 'Reservoir simulation proficiency'], deadline: '2025-04-30', applicationMode: 'internal', featured: true, postedDate: '2 days ago' },
  { id: 'j2', companyId: 'c2', companyName: 'Halliburton', title: 'Drilling Engineer Intern', location: 'Dubai, UAE', remoteType: 'on-site', employmentType: 'internship', experienceLevel: 'Entry Level', salaryRange: '$3,500/mo', description: 'Summer internship for petroleum engineering students interested in drilling.', requirements: ['BSc/MSc in Petroleum or Mechanical Engineering', 'Strong analytical skills'], deadline: '2025-05-15', applicationMode: 'internal', featured: true, postedDate: '5 days ago' },
  { id: 'j3', companyId: 'c3', companyName: 'Baker Hughes', title: 'Reservoir Simulation Analyst', location: 'London, UK', remoteType: 'hybrid', employmentType: 'full-time', experienceLevel: 'Senior', salaryRange: '£80K - £110K', description: 'Lead reservoir simulation projects using advanced modeling tools.', requirements: ['MSc/PhD in Petroleum Engineering', '5+ years experience', 'Eclipse/CMG proficiency'], deadline: '2025-06-01', applicationMode: 'hybrid', featured: false, postedDate: '1 week ago' },
  { id: 'j4', companyId: 'c4', companyName: 'TotalEnergies', title: 'Production Operations Engineer', location: 'Lagos, Nigeria', remoteType: 'on-site', employmentType: 'full-time', experienceLevel: 'Mid Level', salaryRange: '$85K - $115K', description: 'Manage production operations for offshore assets in the Gulf of Guinea.', requirements: ['BSc in Engineering', '3+ years in production ops', 'Offshore experience preferred'], deadline: '2025-05-30', applicationMode: 'external', featured: false, postedDate: '3 days ago' },
  { id: 'j5', companyId: 'c5', companyName: 'Shell', title: 'Subsurface Data Scientist', location: 'The Hague, Netherlands', remoteType: 'hybrid', employmentType: 'full-time', experienceLevel: 'Senior', salaryRange: '€90K - €120K', description: 'Apply ML and analytics to subsurface data for exploration optimization.', requirements: ['MSc/PhD in Geoscience or Data Science', 'Python/ML experience'], deadline: '2025-07-01', applicationMode: 'internal', featured: true, postedDate: '1 day ago' },
  { id: 'j6', companyId: 'c6', companyName: 'Chevron', title: 'HSE Graduate Trainee', location: 'Perth, Australia', remoteType: 'on-site', employmentType: 'full-time', experienceLevel: 'Entry Level', salaryRange: 'AUD 75K - 90K', description: 'Graduate program in health, safety, and environment.', requirements: ['Recent graduate in Engineering', 'Safety-first mindset'], deadline: '2025-04-15', applicationMode: 'internal', featured: false, postedDate: '1 week ago' },
  { id: 'j7', companyId: 'c1', companyName: 'Schlumberger', title: 'Well Integrity Engineer', location: 'Abu Dhabi, UAE', remoteType: 'on-site', employmentType: 'contract', experienceLevel: 'Mid Level', salaryRange: '$110K - $140K', description: 'Ensure well integrity compliance across Middle East operations.', requirements: ['BSc in Petroleum/Mechanical Engineering', 'Well barrier knowledge'], deadline: '2025-05-01', applicationMode: 'internal', featured: false, postedDate: '4 days ago' },
];

export const applications: Application[] = [
  { id: 'a1', jobId: 'j1', jobTitle: 'Petroleum Engineer', companyName: 'Schlumberger', status: 'under_review', appliedAt: 'Mar 5, 2025' },
  { id: 'a5', jobId: 'j5', jobTitle: 'Subsurface Data Scientist', companyName: 'Shell', status: 'rejected', appliedAt: 'Mar 17, 2025' },
  { id: 'a8', jobId: 'j3', jobTitle: 'Reservoir Simulation Analyst', companyName: 'Baker Hughes', status: 'shortlisted', appliedAt: 'Mar 20, 2025' },
  { id: 'a9', jobId: 'j6', jobTitle: 'HSE Graduate Trainee', companyName: 'Chevron', status: 'submitted', appliedAt: 'Mar 22, 2025' },
];

export const savedJobs: SavedJob[] = [
  { id: 's1', job: jobs[0], savedAt: 'Mar 10, 2025' },
  { id: 's2', job: jobs[2], savedAt: 'Mar 12, 2025' },
  { id: 's3', job: jobs[4], savedAt: 'Mar 18, 2025' },
];

export const notifications = [
  { id: 'n1', title: 'Application Update', body: 'Your application for Petroleum Engineer at Schlumberger is now under review.', type: 'application', read: false, createdAt: 'Mar 25, 2025' },
  { id: 'n2', title: 'New Job Match', body: 'A new job matching your profile has been posted: Well Integrity Engineer at Schlumberger.', type: 'job', read: false, createdAt: 'Mar 24, 2025' },
  { id: 'n3', title: 'Deadline Reminder', body: 'HSE Graduate Trainee at Chevron application deadline is in 3 days.', type: 'reminder', read: true, createdAt: 'Mar 22, 2025' },
  { id: 'n4', title: 'Profile Tip', body: 'Complete your profile to increase visibility to employers. You are at 92%.', type: 'system', read: true, createdAt: 'Mar 20, 2025' },
];
