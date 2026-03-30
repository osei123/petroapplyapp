import fs from 'fs';
import { companies, jobs, applications } from '../src/lib/mock-data';

// Helper to generate a deterministic pseudo-UUID based on a string salt
function stringToUuid(str) {
  // Simple hash for deterministic UUID mapping from "c1", "j1"
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex}`;
}

const companyIdMap = {};
const jobIdMap = {};

function escapeSql(str) {
  if (str === null || str === undefined || str === '') return 'NULL';
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (Array.isArray(str)) {
    return `ARRAY[${str.map(s => `'${s.replace(/'/g, "''")}'`).join(',')}]`;
  }
  return `'${String(str).replace(/'/g, "''")}'`;
}

let sql = '';

// Companies
companies.forEach(c => {
  const uuid = stringToUuid(c.id);
  companyIdMap[c.id] = uuid;
  sql += `INSERT INTO public.companies (id, name, logo_url, headquarters, industry_segment, description) 
  VALUES ('${uuid}', ${escapeSql(c.name)}, ${escapeSql(c.logoUrl)}, ${escapeSql(c.headquarters)}, ${escapeSql(c.industrySegment)}, ${escapeSql(c.description)}) 
  ON CONFLICT (id) DO NOTHING;\n`;
});

// Jobs
jobs.forEach(j => {
  const uuid = stringToUuid(j.id);
  const companyUuid = companyIdMap[j.companyId];
  jobIdMap[j.id] = uuid;
  sql += `INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('${uuid}', '${companyUuid}', ${escapeSql(j.title)}, ${escapeSql(j.location)}, ${escapeSql(j.remoteType)}, ${escapeSql(j.employmentType)}, ${escapeSql(j.experienceLevel)}, ${escapeSql(j.salaryRange)}, ${escapeSql(j.description)}, ${escapeSql(j.requirements)}, ${escapeSql(j.deadline)}, ${escapeSql(j.applicationMode)}, ${escapeSql(j.featured)}) 
  ON CONFLICT (id) DO NOTHING;\n`;
});

fs.writeFileSync('seed.sql', sql);
console.log('generated seed.sql with UUIDs');
