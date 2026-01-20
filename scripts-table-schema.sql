create table public.scripts (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  title text not null,
  content jsonb not null,
  platform text not null,
  topic text not null,
  tone text not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  length text null default '60s'::text,
  language text null default 'English'::text,
  framework text null default 'None'::text,
  "calendarDays" integer null default 0,
  constraint scripts_pkey primary key (id),
  constraint scripts_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;