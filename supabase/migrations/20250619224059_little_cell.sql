/*
  # Extended Teams Platform Schema

  1. New Tables
    - `projects` - Project management within teams
    - `project_members` - Project assignments
    - `user_profiles_extended` - Extended user profile data
    - `team_settings` - Team configuration and preferences
    
  2. Enhanced Features
    - Username system with discriminators
    - Project management capabilities
    - Enhanced team roles and permissions
    - Activity tracking
    
  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for team-based access
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_members table
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'contributor' CHECK (role IN ('lead', 'contributor', 'reviewer')),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create user_profiles_extended table for additional user data
CREATE TABLE IF NOT EXISTS user_profiles_extended (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  username text UNIQUE,
  discriminator text,
  display_name text,
  bio text,
  skills text[],
  languages text[],
  hourly_rate integer,
  availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'away', 'offline')),
  work_hours text,
  sleep_hours text,
  auto_status boolean DEFAULT true,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_settings table
CREATE TABLE IF NOT EXISTS team_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_public boolean DEFAULT false,
  auto_assign_projects boolean DEFAULT false,
  require_approval boolean DEFAULT true,
  default_project_visibility text DEFAULT 'team' CHECK (default_project_visibility IN ('team', 'public', 'private')),
  notification_settings jsonb DEFAULT '{}',
  integration_settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity_logs table for tracking team/project activities
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can read projects from their teams"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Project creators can update their projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Project members policies
CREATE POLICY "Users can read project members from their teams"
  ON project_members
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can manage project members"
  ON project_members
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE tm.user_id = auth.uid() AND tm.role IN ('owner', 'admin')
    )
  );

-- User profiles extended policies
CREATE POLICY "Users can read own extended profile"
  ON user_profiles_extended
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own extended profile"
  ON user_profiles_extended
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own extended profile"
  ON user_profiles_extended
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Team members can read each other's extended profiles"
  ON user_profiles_extended
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT tm1.user_id FROM team_members tm1
      WHERE tm1.team_id IN (
        SELECT tm2.team_id FROM team_members tm2
        WHERE tm2.user_id = auth.uid()
      )
    )
  );

-- Team settings policies
CREATE POLICY "Team owners and admins can manage team settings"
  ON team_settings
  FOR ALL
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Team members can read team settings"
  ON team_settings
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Activity logs policies
CREATE POLICY "Users can read activity logs from their teams"
  ON activity_logs
  FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create activity logs for their teams"
  ON activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Function to generate unique username with discriminator
CREATE OR REPLACE FUNCTION generate_unique_username(base_username text)
RETURNS text AS $$
DECLARE
  discriminator text;
  full_username text;
  counter integer := 1;
BEGIN
  -- Clean the base username
  base_username := regexp_replace(lower(base_username), '[^a-z0-9]', '', 'g');
  base_username := substring(base_username from 1 for 20);
  
  -- If empty after cleaning, use 'user'
  IF base_username = '' THEN
    base_username := 'user';
  END IF;
  
  LOOP
    -- Generate a 4-digit discriminator
    discriminator := lpad(floor(random() * 10000)::text, 4, '0');
    full_username := base_username || '#' || discriminator;
    
    -- Check if this combination exists
    IF NOT EXISTS (
      SELECT 1 FROM user_profiles_extended 
      WHERE username = base_username AND discriminator = discriminator
    ) THEN
      -- Update the user's profile with the new username
      INSERT INTO user_profiles_extended (id, username, discriminator, display_name)
      VALUES (auth.uid(), base_username, discriminator, base_username)
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        discriminator = EXCLUDED.discriminator,
        updated_at = now();
      
      RETURN full_username;
    END IF;
    
    counter := counter + 1;
    -- Prevent infinite loop
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique username after 100 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create default team settings
CREATE OR REPLACE FUNCTION create_default_team_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO team_settings (team_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for team settings creation
DROP TRIGGER IF EXISTS on_team_settings_created ON teams;
CREATE TRIGGER on_team_settings_created
  AFTER INSERT ON teams
  FOR EACH ROW EXECUTE FUNCTION create_default_team_settings();

-- Function to log team activities
CREATE OR REPLACE FUNCTION log_team_activity(
  p_team_id uuid,
  p_project_id uuid DEFAULT NULL,
  p_action text,
  p_details jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (team_id, project_id, user_id, action, details)
  VALUES (p_team_id, p_project_id, auth.uid(), p_action, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_extended_updated_at
  BEFORE UPDATE ON user_profiles_extended
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_settings_updated_at
  BEFORE UPDATE ON team_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_extended_username ON user_profiles_extended(username, discriminator);
CREATE INDEX IF NOT EXISTS idx_activity_logs_team_id ON activity_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);