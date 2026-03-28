-- CareLink Database Schema

-- Profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text CHECK (role IN ('caregiver', 'care_recipient')),
  date_of_birth date,
  emergency_contact jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Caregiver assignments
CREATE TABLE IF NOT EXISTS public.caregiver_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship_type text,
  status text CHECK (status IN ('active', 'pending', 'revoked')) DEFAULT 'pending',
  assigned_at timestamptz DEFAULT now()
);

ALTER TABLE public.caregiver_assignments ENABLE ROW LEVEL SECURITY;

-- Caregivers can see their own assignments
CREATE POLICY "assignments_caregiver_select" ON public.caregiver_assignments
  FOR SELECT USING (auth.uid() = caregiver_id OR auth.uid() = recipient_id);

CREATE POLICY "assignments_caregiver_insert" ON public.caregiver_assignments
  FOR INSERT WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "assignments_update" ON public.caregiver_assignments
  FOR UPDATE USING (auth.uid() = caregiver_id OR auth.uid() = recipient_id);

-- Allow caregivers to read profiles of their assigned recipients
CREATE POLICY "profiles_caregiver_read_recipients" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = profiles.id
      AND status = 'active'
    )
  );

-- Allow recipients to read profiles of their assigned caregivers
CREATE POLICY "profiles_recipient_read_caregivers" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE recipient_id = auth.uid()
      AND caregiver_id = profiles.id
      AND status = 'active'
    )
  );

-- Health vitals
CREATE TABLE IF NOT EXISTS public.health_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  recorded_by uuid REFERENCES public.profiles(id),
  vital_type text,
  value_primary numeric,
  value_secondary numeric,
  unit text,
  notes text,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE public.health_vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vitals_recipient_select" ON public.health_vitals
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "vitals_recipient_insert" ON public.health_vitals
  FOR INSERT WITH CHECK (auth.uid() = recipient_id OR auth.uid() = recorded_by);

CREATE POLICY "vitals_caregiver_select" ON public.health_vitals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = health_vitals.recipient_id
      AND status = 'active'
    )
  );

CREATE POLICY "vitals_caregiver_insert" ON public.health_vitals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = health_vitals.recipient_id
      AND status = 'active'
    )
  );

-- Medications
CREATE TABLE IF NOT EXISTS public.medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text,
  frequency text,
  start_date date,
  end_date date,
  prescribing_doctor text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "medications_recipient_select" ON public.medications
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "medications_caregiver_select" ON public.medications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = medications.recipient_id
      AND status = 'active'
    )
  );

CREATE POLICY "medications_caregiver_insert" ON public.medications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = medications.recipient_id
      AND status = 'active'
    )
  );

CREATE POLICY "medications_caregiver_update" ON public.medications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = medications.recipient_id
      AND status = 'active'
    )
  );

-- Medication logs
CREATE TABLE IF NOT EXISTS public.medication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid REFERENCES public.medications(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  taken_at timestamptz DEFAULT now(),
  taken boolean DEFAULT false,
  notes text
);

ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "med_logs_recipient_all" ON public.medication_logs
  FOR ALL USING (auth.uid() = recipient_id);

CREATE POLICY "med_logs_caregiver_select" ON public.medication_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = medication_logs.recipient_id
      AND status = 'active'
    )
  );

CREATE POLICY "med_logs_caregiver_insert" ON public.medication_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = medication_logs.recipient_id
      AND status = 'active'
    )
  );

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  doctor_name text,
  facility text,
  appointment_type text,
  scheduled_at timestamptz,
  notes text,
  status text CHECK (status IN ('upcoming', 'completed', 'cancelled')) DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_recipient_all" ON public.appointments
  FOR ALL USING (auth.uid() = recipient_id);

CREATE POLICY "appointments_caregiver_select" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = appointments.recipient_id
      AND status = 'active'
    )
  );

CREATE POLICY "appointments_caregiver_insert" ON public.appointments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = appointments.recipient_id
      AND status = 'active'
    )
  );

CREATE POLICY "appointments_caregiver_update" ON public.appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.caregiver_assignments
      WHERE caregiver_id = auth.uid()
      AND recipient_id = appointments.recipient_id
      AND status = 'active'
    )
  );

-- Health alerts
CREATE TABLE IF NOT EXISTS public.health_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  caregiver_id uuid REFERENCES public.profiles(id),
  alert_type text,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message text,
  is_read boolean DEFAULT false,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alerts_recipient_select" ON public.health_alerts
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "alerts_caregiver_select" ON public.health_alerts
  FOR SELECT USING (auth.uid() = caregiver_id);

CREATE POLICY "alerts_caregiver_insert" ON public.health_alerts
  FOR INSERT WITH CHECK (
    auth.uid() = caregiver_id OR auth.uid() = recipient_id
  );

CREATE POLICY "alerts_update" ON public.health_alerts
  FOR UPDATE USING (auth.uid() = caregiver_id OR auth.uid() = recipient_id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', null),
    COALESCE(new.raw_user_meta_data ->> 'role', 'care_recipient')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
