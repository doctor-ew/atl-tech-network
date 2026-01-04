-- Seed data migration for Atlanta Tech Network
-- This will populate the database with the initial hardcoded data

-- Insert common tags first
INSERT INTO tags (name) VALUES
  ('Programming'), ('Web Development'), ('JavaScript'), ('Python'), ('Java'),
  ('Frontend'), ('Backend'), ('Full-Stack'), ('Mobile Development'), ('DevOps'),
  ('Cloud'), ('AI'), ('Data Science'), ('Cybersecurity'), ('Database'),
  ('Design'), ('UX'), ('Diversity'), ('Networking'), ('Careers'),
  ('Education'), ('Bootcamp'), ('Community'), ('Open Source'), ('Startups'),
  ('React'), ('Angular'), ('Vue'), ('Node.js'), ('Spring'),
  ('Docker'), ('Kubernetes'), ('AWS'), ('Azure'), ('GCP'),
  ('Machine Learning'), ('Blockchain'), ('IoT'), ('Game Development'),
  ('Product Management'), ('Leadership'), ('Entrepreneurship'), ('Remote Work'),
  ('HTML'), ('CSS'), ('PHP'), ('Ruby'), ('Rails'), ('Django'), ('Flask'),
  ('TypeScript'), ('Kotlin'), ('Swift'), ('Go'), ('Rust'),
  ('Women in Tech'), ('LGBTQ+'), ('Latinx'), ('Black in Tech'),
  ('Accessibility'), ('Ethics'), ('Security'), ('Testing'),
  ('Mentorship'), ('Speaking'), ('Conferences'), ('Meetups'),
  ('Free/Low-Cost'), ('Certifications'), ('Virtual'), ('Innovation')
ON CONFLICT (name) DO NOTHING;

-- Note: The actual resource insertion should be done programmatically
-- or through a separate script that reads from the existing sample-data.ts
-- This is just the schema setup and tag seeding.

-- For now, you can run this after setting up the database connection
-- to migrate existing hardcoded data to the database
