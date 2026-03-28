-- ============================================================
-- PASO 1: Arreglar bug de recursión en RLS de profiles
-- ============================================================
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

drop policy if exists "profiles_select_recipients_for_caregivers" on public.profiles;
create policy "profiles_select_recipients_for_caregivers"
  on public.profiles for select
  using (
    role = 'care_recipient'
    and public.is_caregiver()
  );

-- Permitir que un usuario autenticado cree su propio perfil (fallback si el trigger falla)
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

-- ============================================================
-- PASO 2: Confirmar usuarios existentes (sin necesidad de email)
-- ============================================================
update auth.users
set email_confirmed_at = now(),
    confirmation_token = '',
    confirmation_sent_at = null
where email_confirmed_at is null;

-- ============================================================
-- PASO 3: Crear usuario cuidador de prueba
-- ============================================================
-- Verificar si ya existe antes de insertar
do $$
declare
  _uid uuid;
begin
  -- Crear cuidador solo si no existe
  if not exists (select 1 from auth.users where email = 'cuidador.carelink@yopmail.com') then
    _uid := gen_random_uuid();
    insert into auth.users (
      id, instance_id, aud, role, email,
      encrypted_password,
      email_confirmed_at, confirmation_token,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) values (
      _uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      'cuidador.carelink@yopmail.com',
      crypt('Demo1234!', gen_salt('bf')),
      now(), '',
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', 'Dr. Carlos García', 'role', 'caregiver', 'email', 'cuidador.carelink@yopmail.com', 'email_verified', true, 'phone_verified', false),
      now(), now()
    );

    insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (
      gen_random_uuid(), _uid,
      jsonb_build_object('sub', _uid::text, 'email', 'cuidador.carelink@yopmail.com', 'full_name', 'Dr. Carlos García', 'role', 'caregiver', 'email_verified', true, 'phone_verified', false),
      'email', _uid::text,
      now(), now(), now()
    );
  end if;
end;
$$;

-- ============================================================
-- PASO 4: Asegurar que ambos tengan perfil
-- ============================================================
insert into public.profiles (id, full_name, role)
select u.id,
       coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), ''),
       coalesce(u.raw_user_meta_data ->> 'role', 'care_recipient')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
