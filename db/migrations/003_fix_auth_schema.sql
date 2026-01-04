-- Migration: Fix Auth.js Schema to use correct column names
-- Created: 2026-01-04
-- Description: Drops and recreates auth tables with camelCase column names required by @auth/pg-adapter

-- Drop existing tables (they're empty anyway)
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (required by @auth/pg-adapter)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT
);

-- Accounts table (required by @auth/pg-adapter)
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT
);

-- Sessions table (required by @auth/pg-adapter)
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL
);

-- Verification tokens table (required by @auth/pg-adapter)
CREATE TABLE verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- User profiles table (custom - for additional user data)
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  company VARCHAR(255),
  location VARCHAR(255),
  website TEXT,
  github_username VARCHAR(255),
  twitter_username VARCHAR(255),
  linkedin_username VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  can_approve_submissions BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_accounts_user_id ON accounts("userId");
CREATE INDEX idx_sessions_user_id ON sessions("userId");
CREATE INDEX idx_sessions_session_token ON sessions("sessionToken");
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_users_email ON users(email);
