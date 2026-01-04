-- Atlanta Tech Network Database Schema

-- Resource types enum
CREATE TYPE resource_type AS ENUM ('meetup', 'conference', 'online', 'tech-hub');

-- Resource status enum (for moderation)
CREATE TYPE resource_status AS ENUM ('pending', 'approved', 'rejected');

-- Main resources table
CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  type resource_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  image TEXT,
  conference_date DATE,
  cfp_date DATE,
  status resource_status DEFAULT 'pending',
  submitted_by VARCHAR(255),
  submitted_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tags table (many-to-many relationship)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Resource tags junction table
CREATE TABLE resource_tags (
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- Submissions table (for tracking user submissions before approval)
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  type resource_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  image TEXT,
  conference_date DATE,
  cfp_date DATE,
  tags TEXT[], -- Store as array for easier submission
  submitted_by VARCHAR(255),
  submitter_email VARCHAR(255),
  status resource_status DEFAULT 'pending',
  rejection_reason TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(255)
);

-- Indexes for better query performance
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_conference_date ON resources(conference_date);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
