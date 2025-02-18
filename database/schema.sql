-- Reduce unnecessary messages
SET client_min_messages TO WARNING;

-- Drop and recreate schema (DANGER: Erases all data!)
DROP SCHEMA "public" CASCADE;
CREATE SCHEMA "public";

-- Shows table
CREATE TABLE "shows" (
  "showId" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "image" TEXT, -- URL for the show image
  "rating" DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 10) -- Ensure valid ratings
);

-- Users table
CREATE TABLE "users" (
  "userId" SERIAL PRIMARY KEY,
  "userName" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL -- Store hashed passwords securely
);

-- Reviews table
CREATE TABLE "reviews" (
  "reviewId" SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "showId" INTEGER NOT NULL,
  "reviewText" TEXT NOT NULL,
  "rating" DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_reviews_user FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE CASCADE,
  CONSTRAINT fk_reviews_show FOREIGN KEY ("showId") REFERENCES "shows" ("showId") ON DELETE CASCADE
);

-- Favorites table (user-show relationships)
CREATE TABLE "favorites" (
  "userId" INTEGER NOT NULL,
  "showId" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY ("userId", "showId"),
  CONSTRAINT fk_favorites_user FOREIGN KEY ("userId") REFERENCES "users" ("userId") ON DELETE CASCADE,
  CONSTRAINT fk_favorites_show FOREIGN KEY ("showId") REFERENCES "shows" ("showId") ON DELETE CASCADE
);
