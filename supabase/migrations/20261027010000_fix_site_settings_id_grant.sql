-- Hotfix for the public settings column grants.
-- The application filters site_settings by id=true. PostgreSQL requires SELECT
-- privilege on that column even when it is only used in the WHERE clause.
-- Safe to apply after 20261027000000_security_public_settings.sql.

begin;
grant select (id) on public.site_settings to anon, authenticated;
commit;
