-- Campos clínicos en profiles para personas cuidadas
alter table public.profiles
  add column if not exists age integer,
  add column if not exists blood_type text,
  add column if not exists allergies text,
  add column if not exists medical_conditions text[];
