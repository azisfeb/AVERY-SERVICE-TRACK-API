-- Supabase schema for AVERY Service Tracking

-- Users table is managed by Supabase Auth. We store additional profile metadata here.
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  phone text,
  company text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Units (tractor / equipment)
CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gps_id text NOT NULL UNIQUE,
  unit_model text,
  owner_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Hour meter logs (start/stop segments from GPS ignition)
CREATE TABLE IF NOT EXISTS hour_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES units(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_seconds bigint GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (end_time - start_time))::bigint) STORED,
  created_at timestamptz DEFAULT now()
);

-- Service records
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES units(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  hour_at_service bigint NOT NULL,
  service_date timestamptz DEFAULT now(),
  notes text
);

-- Notification history for admins
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES units(id) ON DELETE SET NULL,
  type text,
  payload jsonb,
  sent_at timestamptz DEFAULT now()
);
