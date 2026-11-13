create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  answers jsonb not null,
  other_answers jsonb not null default '{}'::jsonb,
  email text,
  email_contact_consent boolean not null default false,
  research_consent boolean not null default false,
  cohort text not null default 'unclassified'
);

alter table public.survey_responses enable row level security;

-- No anon/authenticated policies are created. Browser clients cannot read or write
-- this table directly. The Next.js server route inserts with the service-role key.
revoke all on public.survey_responses from anon, authenticated;
grant all on public.survey_responses to service_role;

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at desc);
create index if not exists survey_responses_cohort_idx
  on public.survey_responses (cohort);
