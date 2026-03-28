-- MVP-IMS: esquema alineado con la app Next.js (auth + perfiles + salud)

-- ---------------------------------------------------------------------------
-- Perfiles (1:1 con auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'care_recipient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('caregiver', 'care_recipient'))
);

create index profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- Asignaciones cuidador <-> persona cuidada
-- ---------------------------------------------------------------------------
create table public.caregiver_assignments (
  id uuid primary key default gen_random_uuid(),
  caregiver_id uuid not null references public.profiles (id) on delete cascade,
  care_recipient_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint caregiver_assignments_status_check check (status in ('active', 'pending')),
  constraint caregiver_assignments_unique_pair unique (caregiver_id, care_recipient_id),
  constraint caregiver_assignments_distinct check (caregiver_id <> care_recipient_id)
);

create index caregiver_assignments_caregiver_idx on public.caregiver_assignments (caregiver_id);
create index caregiver_assignments_recipient_idx on public.caregiver_assignments (care_recipient_id);

-- ---------------------------------------------------------------------------
-- Medicamentos y registros
-- ---------------------------------------------------------------------------
create table public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  dosage text not null default '',
  frequency text not null default '',
  schedule_times jsonb not null default '[]'::jsonb,
  instructions text,
  prescribing_doctor text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index medications_user_id_idx on public.medications (user_id);

create table public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references public.medications (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'taken',
  logged_by uuid not null references auth.users (id),
  notes text,
  taken_at timestamptz not null default now(),
  constraint medication_logs_status_check check (status in ('taken', 'skipped', 'missed'))
);

create index medication_logs_user_idx on public.medication_logs (user_id);
create index medication_logs_med_idx on public.medication_logs (medication_id);
create index medication_logs_taken_at_idx on public.medication_logs (taken_at desc);

-- ---------------------------------------------------------------------------
-- Alertas, citas, signos vitales
-- ---------------------------------------------------------------------------
create table public.health_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  alert_type text not null default 'general',
  severity text not null default 'info',
  title text not null,
  message text,
  is_read boolean not null default false,
  is_resolved boolean not null default false,
  resolved_by uuid references auth.users (id),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint health_alerts_severity_check check (
    severity in ('info', 'warning', 'critical')
  )
);

create index health_alerts_user_idx on public.health_alerts (user_id);
create index health_alerts_created_idx on public.health_alerts (created_at desc);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  doctor_name text,
  location text,
  appointment_date timestamptz not null,
  duration_minutes integer not null default 30,
  notes text,
  status text not null default 'scheduled',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  constraint appointments_status_check check (
    status in ('scheduled', 'completed', 'cancelled')
  )
);

create index appointments_user_idx on public.appointments (user_id);
create index appointments_date_idx on public.appointments (appointment_date);

create table public.health_vitals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recorded_by uuid not null references auth.users (id),
  vital_type text not null,
  value numeric not null,
  secondary_value numeric,
  unit text,
  notes text,
  recorded_at timestamptz not null default now()
);

create index health_vitals_user_idx on public.health_vitals (user_id);
create index health_vitals_recorded_idx on public.health_vitals (recorded_at desc);

-- ---------------------------------------------------------------------------
-- Trigger: crear perfil al registrarse
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      ''
    ),
    coalesce(new.raw_user_meta_data ->> 'role', 'care_recipient')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- updated_at automático en profiles / medications
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger medications_updated_at
  before update on public.medications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.caregiver_assignments enable row level security;
alter table public.medications enable row level security;
alter table public.medication_logs enable row level security;
alter table public.health_alerts enable row level security;
alter table public.appointments enable row level security;
alter table public.health_vitals enable row level security;

-- Helper: cuidador activo asignado al paciente
create or replace function public.is_active_caregiver_for(patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.caregiver_assignments ca
    where ca.caregiver_id = auth.uid()
      and ca.care_recipient_id = patient_id
      and ca.status = 'active'
  );
$$;

-- profiles
create policy "profiles_select_own_or_assigned"
  on public.profiles for select
  using (
    id = auth.uid()
    or public.is_active_caregiver_for(id)
  );

-- Helper: verificar si el usuario actual es cuidador (SECURITY DEFINER evita recursión RLS)
create or replace function public.is_caregiver()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'caregiver'
  );
$$;

create policy "profiles_select_recipients_for_caregivers"
  on public.profiles for select
  using (
    role = 'care_recipient'
    and public.is_caregiver()
  );

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

-- caregiver_assignments
create policy "caregiver_assignments_select_participants"
  on public.caregiver_assignments for select
  using (caregiver_id = auth.uid() or care_recipient_id = auth.uid());

create policy "caregiver_assignments_insert_as_caregiver"
  on public.caregiver_assignments for insert
  with check (caregiver_id = auth.uid());

-- medications
create policy "medications_select"
  on public.medications for select
  using (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

create policy "medications_insert"
  on public.medications for insert
  with check (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

create policy "medications_update"
  on public.medications for update
  using (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

-- medication_logs
create policy "medication_logs_select"
  on public.medication_logs for select
  using (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

create policy "medication_logs_insert"
  on public.medication_logs for insert
  with check (
    logged_by = auth.uid()
    and (user_id = auth.uid() or public.is_active_caregiver_for(user_id))
  );

-- health_alerts
create policy "health_alerts_select"
  on public.health_alerts for select
  using (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

create policy "health_alerts_update"
  on public.health_alerts for update
  using (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

-- appointments
create policy "appointments_select"
  on public.appointments for select
  using (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

create policy "appointments_insert"
  on public.appointments for insert
  with check (
    created_by = auth.uid()
    and (user_id = auth.uid() or public.is_active_caregiver_for(user_id))
  );

-- health_vitals
create policy "health_vitals_select"
  on public.health_vitals for select
  using (user_id = auth.uid() or public.is_active_caregiver_for(user_id));

create policy "health_vitals_insert"
  on public.health_vitals for insert
  with check (
    recorded_by = auth.uid()
    and (user_id = auth.uid() or public.is_active_caregiver_for(user_id))
  );
