-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing functions if they exist (to allow schema changes)
DROP FUNCTION IF EXISTS match_technologies(vector, float, int);
DROP FUNCTION IF EXISTS match_pilots(vector, float, int);
DROP FUNCTION IF EXISTS match_watchlist(vector, float, int);
DROP FUNCTION IF EXISTS match_portfolio(vector, float, int);

-- Add embedding columns to technologies table
ALTER TABLE technologies
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS content_for_search text;

-- Add embedding columns to pilots table
ALTER TABLE pilots
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS content_for_search text;

-- Add embedding columns to market_watchlist table
ALTER TABLE market_watchlist
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS content_for_search text;

-- Create indexes for vector similarity search
CREATE INDEX IF NOT EXISTS technologies_embedding_idx
ON technologies USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS pilots_embedding_idx
ON pilots USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS market_watchlist_embedding_idx
ON market_watchlist USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function to search technologies by semantic similarity
CREATE OR REPLACE FUNCTION match_technologies(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  tech_id text,
  title text,
  description text,
  category text,
  status text,
  content_for_search text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    technologies.id,
    technologies.tech_id,
    technologies.title,
    technologies.description,
    technologies.category,
    technologies.status,
    technologies.content_for_search,
    1 - (technologies.embedding <=> query_embedding) AS similarity
  FROM technologies
  WHERE 1 - (technologies.embedding <=> query_embedding) > match_threshold
  ORDER BY technologies.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to search pilots by semantic similarity
CREATE OR REPLACE FUNCTION match_pilots(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  pilot_id text,
  title text,
  technology_id text,
  status text,
  content_for_search text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pilots.id,
    pilots.pilot_id,
    pilots.title,
    pilots.technology_id,
    pilots.status,
    pilots.content_for_search,
    1 - (pilots.embedding <=> query_embedding) AS similarity
  FROM pilots
  WHERE 1 - (pilots.embedding <=> query_embedding) > match_threshold
  ORDER BY pilots.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to search market intelligence by semantic similarity
CREATE OR REPLACE FUNCTION match_watchlist(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  technology text,
  vendor text,
  signal text,
  priority text,
  content_for_search text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    market_watchlist.id,
    market_watchlist.technology,
    market_watchlist.vendor,
    market_watchlist.signal,
    market_watchlist.priority,
    market_watchlist.content_for_search,
    1 - (market_watchlist.embedding <=> query_embedding) AS similarity
  FROM market_watchlist
  WHERE 1 - (market_watchlist.embedding <=> query_embedding) > match_threshold
  ORDER BY market_watchlist.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create unified search function across all tables
CREATE OR REPLACE FUNCTION match_portfolio(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  source text,
  id uuid,
  title text,
  description text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  (
    SELECT
      'technology'::text AS source,
      technologies.id,
      technologies.title,
      technologies.description,
      technologies.content_for_search AS content,
      1 - (technologies.embedding <=> query_embedding) AS similarity
    FROM technologies
    WHERE 1 - (technologies.embedding <=> query_embedding) > match_threshold
  )
  UNION ALL
  (
    SELECT
      'pilot'::text AS source,
      pilots.id,
      pilots.title,
      pilots.objectives AS description,
      pilots.content_for_search AS content,
      1 - (pilots.embedding <=> query_embedding) AS similarity
    FROM pilots
    WHERE 1 - (pilots.embedding <=> query_embedding) > match_threshold
  )
  UNION ALL
  (
    SELECT
      'market_intelligence'::text AS source,
      market_watchlist.id,
      market_watchlist.technology AS title,
      market_watchlist.notes AS description,
      market_watchlist.content_for_search AS content,
      1 - (market_watchlist.embedding <=> query_embedding) AS similarity
    FROM market_watchlist
    WHERE 1 - (market_watchlist.embedding <=> query_embedding) > match_threshold
  )
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION match_technologies IS 'Search technologies using semantic similarity';
COMMENT ON FUNCTION match_pilots IS 'Search pilots using semantic similarity';
COMMENT ON FUNCTION match_watchlist IS 'Search market intelligence using semantic similarity';
COMMENT ON FUNCTION match_portfolio IS 'Search across all portfolio data using semantic similarity';
