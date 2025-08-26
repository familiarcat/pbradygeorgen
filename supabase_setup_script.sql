-- Supabase Database Setup Script for Crew Memory System
-- Generated on: 2025-08-26T03:34:37.527741
-- Execute this in Supabase SQL Editor
-- Version: 1.0.0

-- Enable UUID extension for better ID handling
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crew Memories Table
CREATE TABLE IF NOT EXISTS crew_memories (
    id SERIAL PRIMARY KEY,
    crew_member VARCHAR(100) NOT NULL,
    mission_id VARCHAR(100),
    memory_type VARCHAR(50) DEFAULT 'mission_experience',
    content TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    importance VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mission Logs Table
CREATE TABLE IF NOT EXISTS mission_logs (
    id SERIAL PRIMARY KEY,
    mission_id VARCHAR(100) NOT NULL,
    mission_name VARCHAR(200) NOT NULL,
    mission_type VARCHAR(50) DEFAULT 'crew_operation',
    crew_size INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'in_progress',
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    outcome VARCHAR(50),
    crew_member VARCHAR(100),
    response_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crew_memories_crew_member ON crew_memories(crew_member);
CREATE INDEX IF NOT EXISTS idx_crew_memories_mission_id ON crew_memories(mission_id);
CREATE INDEX IF NOT EXISTS idx_crew_memories_timestamp ON crew_memories(timestamp);

CREATE INDEX IF NOT EXISTS idx_mission_logs_mission_id ON mission_logs(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_logs_crew_member ON mission_logs(crew_member);
CREATE INDEX IF NOT EXISTS idx_mission_logs_status ON mission_logs(status);

-- Grant permissions to anon role (for your API access)
GRANT ALL ON crew_memories TO anon;
GRANT ALL ON mission_logs TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Insert test data to verify tables are working
INSERT INTO crew_memories (crew_member, mission_id, memory_type, content, importance) 
VALUES ('Captain Picard', 'setup-test-001', 'system_setup', 'Database setup completed successfully', 'high')
ON CONFLICT DO NOTHING;

INSERT INTO mission_logs (mission_id, mission_name, mission_type, crew_size, status, outcome, crew_member, response_summary)
VALUES ('setup-test-001', 'Database Setup Test', 'system_configuration', 1, 'completed', 'success', 'Captain Picard', 'Database tables created and accessible')
ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT 'crew_memories' as table_name, COUNT(*) as row_count FROM crew_memories
UNION ALL
SELECT 'mission_logs' as table_name, COUNT(*) as row_count FROM mission_logs;
