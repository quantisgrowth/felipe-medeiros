-- Security hardening for Felipe Medeiros site.
-- REVIEW BEFORE APPLYING. This migration is intentionally NOT executed here.
-- After applying, insert the approved admin user's auth.users UUID into public.site_admins.
-- Keep LEAD_WEBHOOK_URL configured as a server-side environment variable in Lovable.

begin;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;

drop policy if exists "site admins can read own membership" on public.site_admins;
create policy "site admins can read own membership"
  on public.site_admins for select to authenticated
  using (user_id = auth.uid());

create table if not exists public.site_settings_private (
  id boolean primary key default true check (id = true),
  lead_webhook_url text not null default '',
  notification_email text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.site_settings_private enable row level security;
revoke all on public.site_settings_private from anon, authenticated;
grant select, update on public.site_settings_private to authenticated;

drop policy if exists "site admins can read private settings" on public.site_settings_private;
create policy "site admins can read private settings"
  on public.site_settings_private for select to authenticated
  using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

drop policy if exists "site admins can update private settings" on public.site_settings_private;
create policy "site admins can update private settings"
  on public.site_settings_private for update to authenticated
  using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

insert into public.site_settings_private (id, lead_webhook_url, notification_email)
select true, coalesce(lead_webhook_url, ''), coalesce(notification_email, '')
from public.site_settings
where id = true
on conflict (id) do nothing;

-- Remove public access to the full settings row. PostgreSQL RLS is row-based,
-- not column-based; public access must be restricted through column grants.
drop policy if exists "anyone can read settings" on public.site_settings;
drop policy if exists "public can read settings" on public.site_settings;
drop policy if exists "authenticated can read settings" on public.site_settings;
drop policy if exists "authenticated can update settings" on public.site_settings;

revoke all on public.site_settings from anon, authenticated;
-- The id column must also be selectable because app queries filter with .eq("id", true).
grant select (
  id, whatsapp_number, whatsapp_message, email, linkedin_url, privacy_url, terms_url,
  ga_measurement_id, meta_pixel_id, footer_tagline, hero_photo_url, about_photo_url,
  form_roles, form_segments
) on public.site_settings to anon, authenticated;
grant update (
  whatsapp_number, whatsapp_message, email, linkedin_url, privacy_url, terms_url,
  ga_measurement_id, meta_pixel_id, footer_tagline, hero_photo_url, about_photo_url,
  form_roles, form_segments
) on public.site_settings to authenticated;

create policy "public can read public site settings"
  on public.site_settings for select to anon, authenticated using (id = true);

create policy "site admins can update public site settings"
  on public.site_settings for update to authenticated
  using (id = true and exists (select 1 from public.site_admins a where a.user_id = auth.uid()))
  with check (id = true and exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

-- Leads and analytics contain personal data. Remove access for all authenticated
-- users and re-grant read access only to explicitly allowlisted site admins.
drop policy if exists "authenticated can read leads" on public.leads;
create policy "site admins can read leads"
  on public.leads for select to authenticated
  using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

drop policy if exists "authenticated can read page views" on public.page_views;
create policy "site admins can read page views"
  on public.page_views for select to authenticated
  using (exists (select 1 from public.site_admins a where a.user_id = auth.uid()));

-- Public inserts remain for the form and page-view tracking; server-side
-- validation/rate limiting should be added before relying on these for abuse resistance.

commit;

-- REQUIRED MANUAL STEP AFTER REVIEW/APPLY:
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'YOUR_APPROVED_ADMIN_EMAIL';
-- Verify exactly one user is selected before inserting. Do not use an email guessed here.
