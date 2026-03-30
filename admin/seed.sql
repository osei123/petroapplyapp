INSERT INTO public.companies (id, name, logo_url, headquarters, industry_segment, description) 
  VALUES ('00000000-0000-0000-0000-000000000c2e', 'Schlumberger', '/logos/schlumberger.png', 'Houston, TX', 'Oilfield Services', 'World''s largest oilfield services company, providing technology for reservoir characterization, drilling, production, and processing.') 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.companies (id, name, logo_url, headquarters, industry_segment, description) 
  VALUES ('00000000-0000-0000-0000-000000000c2f', 'Halliburton', '/logos/halliburton.png', 'Houston, TX', 'Oilfield Services', 'One of the world''s largest providers of products and services to the energy industry.') 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.companies (id, name, logo_url, headquarters, industry_segment, description) 
  VALUES ('00000000-0000-0000-0000-000000000c30', 'Baker Hughes', '/logos/baker-hughes.png', 'Houston, TX', 'Energy Technology', 'An energy technology company that provides solutions to energy and industrial customers worldwide.') 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.companies (id, name, logo_url, headquarters, industry_segment, description) 
  VALUES ('00000000-0000-0000-0000-000000000c31', 'TotalEnergies', '/logos/totalenergies.png', 'Paris, France', 'Integrated Oil & Gas', 'A broad-energy company, producing and marketing fuels, natural gas and electricity.') 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.companies (id, name, logo_url, headquarters, industry_segment, description) 
  VALUES ('00000000-0000-0000-0000-000000000c32', 'Shell', '/logos/shell.png', 'London, UK', 'Integrated Oil & Gas', 'A global group of energy and petrochemical companies with an aim to meet the world''s growing need for more and cleaner energy solutions.') 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.companies (id, name, logo_url, headquarters, industry_segment, description) 
  VALUES ('00000000-0000-0000-0000-000000000c33', 'Chevron', '/logos/chevron.png', 'San Ramon, CA', 'Integrated Oil & Gas', 'One of the world''s leading integrated energy companies, investing in profitable, lower carbon businesses.') 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('00000000-0000-0000-0000-000000000d07', '00000000-0000-0000-0000-000000000c2e', 'Petroleum Engineer', 'Houston, TX', 'on-site', 'full-time', 'mid', '$95,000 - $130,000', 'Join our team as a Petroleum Engineer working on reservoir simulation and optimization projects across North American operations.', ARRAY['BSc in Petroleum Engineering','3-5 years experience','Reservoir simulation software proficiency'], '2025-04-30', 'internal', TRUE) 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('00000000-0000-0000-0000-000000000d08', '00000000-0000-0000-0000-000000000c2f', 'Drilling Engineer Intern', 'Dubai, UAE', 'on-site', 'internship', 'entry', '$3,500/month', 'Summer internship opportunity for petroleum engineering students interested in drilling and well completions.', ARRAY['Pursuing BSc/MSc in Petroleum or Mechanical Engineering','Strong analytical skills','Willing to relocate'], '2025-05-15', 'internal', TRUE) 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('00000000-0000-0000-0000-000000000d09', '00000000-0000-0000-0000-000000000c30', 'Reservoir Simulation Analyst', 'London, UK', 'hybrid', 'full-time', 'senior', '£80,000 - £110,000', 'Lead reservoir simulation projects using advanced modeling tools for international oil and gas clients.', ARRAY['MSc/PhD in Petroleum Engineering','5+ years experience','Eclipse/CMG proficiency'], '2025-06-01', 'hybrid', FALSE) 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('00000000-0000-0000-0000-000000000d0a', '00000000-0000-0000-0000-000000000c31', 'Production Operations Engineer', 'Lagos, Nigeria', 'on-site', 'full-time', 'mid', '$85,000 - $115,000', 'Manage production operations for offshore assets in the Gulf of Guinea, optimizing well performance and facility throughput.', ARRAY['BSc in Engineering','3+ years in production ops','Offshore experience preferred'], '2025-05-30', 'external', FALSE) 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('00000000-0000-0000-0000-000000000d0b', '00000000-0000-0000-0000-000000000c32', 'Subsurface Data Scientist', 'The Hague, Netherlands', 'hybrid', 'full-time', 'senior', '€90,000 - €120,000', 'Apply machine learning and advanced analytics to subsurface data for exploration and production optimization.', ARRAY['MSc/PhD in Geoscience or Data Science','Python/ML experience','Oil & gas domain knowledge'], '2025-07-01', 'internal', TRUE) 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('00000000-0000-0000-0000-000000000d0c', '00000000-0000-0000-0000-000000000c33', 'HSE Graduate Trainee', 'Perth, Australia', 'on-site', 'full-time', 'entry', 'AUD 75,000 - 90,000', 'Graduate program in health, safety, and environment for recent graduates passionate about operational excellence.', ARRAY['Recent graduate in Engineering/Environmental Science','Strong communication','Safety-first mindset'], '2025-04-15', 'internal', FALSE) 
  ON CONFLICT (id) DO NOTHING;
INSERT INTO public.jobs (id, company_id, title, location, remote_type, employment_type, experience_level, salary_range, description, requirements, deadline, application_mode, featured) 
  VALUES ('00000000-0000-0000-0000-000000000d0d', '00000000-0000-0000-0000-000000000c2e', 'Well Integrity Engineer', 'Abu Dhabi, UAE', 'on-site', 'contract', 'mid', '$110,000 - $140,000', 'Ensure well integrity compliance across Middle East operations.', ARRAY['BSc in Petroleum/Mechanical Engineering','Well barrier knowledge','API standards familiarity'], '2025-05-01', 'internal', FALSE) 
  ON CONFLICT (id) DO NOTHING;
