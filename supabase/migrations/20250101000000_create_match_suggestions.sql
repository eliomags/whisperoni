-- Create match_suggestions table
CREATE TABLE IF NOT EXISTS match_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Suggester info (optional, simplified - no email notifications)
  suggester_name TEXT,
  suggester_message TEXT,

  -- Person 1
  person1_phone TEXT NOT NULL,
  person1_name TEXT,
  person1_user_id UUID,
  person1_joined_at TIMESTAMP WITH TIME ZONE,
  person1_token TEXT UNIQUE NOT NULL,
  person1_status TEXT DEFAULT 'pending' CHECK (person1_status IN ('pending', 'joined', 'declined')),

  -- Person 2
  person2_phone TEXT NOT NULL,
  person2_name TEXT,
  person2_user_id UUID,
  person2_joined_at TIMESTAMP WITH TIME ZONE,
  person2_token TEXT UNIQUE NOT NULL,
  person2_status TEXT DEFAULT 'pending' CHECK (person2_status IN ('pending', 'joined', 'declined')),

  -- Overall status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'one_joined', 'both_joined', 'declined')),

  -- Engagement tracking
  person1_viewed_profile BOOLEAN DEFAULT FALSE,
  person2_viewed_profile BOOLEAN DEFAULT FALSE,
  chat_started BOOLEAN DEFAULT FALSE,
  chat_started_by UUID,
  chat_started_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT different_phones CHECK (person1_phone != person2_phone),
  CONSTRAINT valid_phones CHECK (
    person1_phone ~ '^\+[1-9]\d{1,14}$' AND
    person2_phone ~ '^\+[1-9]\d{1,14}$'
  )
);

-- Indexes for fast lookups
CREATE INDEX idx_person1_phone ON match_suggestions(person1_phone)
  WHERE person1_status = 'pending';

CREATE INDEX idx_person2_phone ON match_suggestions(person2_phone)
  WHERE person2_status = 'pending';

CREATE INDEX idx_person1_token ON match_suggestions(person1_token);
CREATE INDEX idx_person2_token ON match_suggestions(person2_token);

CREATE INDEX idx_user_matches ON match_suggestions(person1_user_id, person2_user_id)
  WHERE status = 'both_joined';

-- Prevent exact duplicate suggestions (same pair)
-- No expiration since links don't expire
CREATE UNIQUE INDEX idx_unique_pair ON match_suggestions(
  LEAST(person1_phone, person2_phone),
  GREATEST(person1_phone, person2_phone)
);

-- Row Level Security
ALTER TABLE match_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow public to create suggestions (anyone can be a matchmaker)
CREATE POLICY "Anyone can create match suggestions"
  ON match_suggestions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own matches only
CREATE POLICY "Users can view their own matches"
  ON match_suggestions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = person1_user_id::text OR
    auth.uid()::text = person2_user_id::text
  );

-- Users can update only their own match status
CREATE POLICY "Users can update their match status"
  ON match_suggestions
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::text = person1_user_id::text OR
    auth.uid()::text = person2_user_id::text
  )
  WITH CHECK (
    auth.uid()::text = person1_user_id::text OR
    auth.uid()::text = person2_user_id::text
  );

-- Function to automatically update status when both join
CREATE OR REPLACE FUNCTION update_match_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update overall status based on individual statuses
  IF NEW.person1_status = 'joined' AND NEW.person2_status = 'joined' THEN
    NEW.status = 'both_joined';
  ELSIF NEW.person1_status = 'joined' OR NEW.person2_status = 'joined' THEN
    NEW.status = 'one_joined';
  ELSIF NEW.person1_status = 'declined' OR NEW.person2_status = 'declined' THEN
    NEW.status = 'declined';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update status
CREATE TRIGGER trigger_update_match_status
  BEFORE UPDATE ON match_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_match_status();

COMMENT ON TABLE match_suggestions IS 'Stores friend-suggested matches between two people';
COMMENT ON COLUMN match_suggestions.status IS 'Overall match status: pending, one_joined, both_joined, declined';
COMMENT ON COLUMN match_suggestions.person1_token IS 'Unique token for person 1 shareable link';
COMMENT ON COLUMN match_suggestions.person2_token IS 'Unique token for person 2 shareable link';
