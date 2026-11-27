-- Lock lister contact details from the public API.
-- Apply ONLY after the code that selects PUBLIC_PROPERTY_COLUMNS (lib/listing.ts) is live:
-- anonymous `select *` on these tables fails after this.
--
-- Anonymous visitors (the public site and anyone with the public anon key) can now read
-- only the columns listed here. Hidden from them:
--   properties: contact_phone, contact_email, admin_notes, verified_by
--   profiles:   phone
-- Signed-in owners keep full access to their own rows (authenticated role, RLS unchanged);
-- the server (service role) is unaffected.
-- If you add a column that the public site must read, grant it to anon in a new migration.

revoke select on public.properties from anon;
grant select (
  id, created_at, title, description, price, currency, property_type, bedrooms, bathrooms,
  location, address, size_sqm, images, user_id, status, latitude, longitude, amenities,
  listing_type, verification_status, videos, preferred_contact, contact_name, deposit_months,
  service_charge, water_sources, power_meter, landmark, title_type, expires_at,
  verification_level, verified_at
) on public.properties to anon;

revoke select on public.profiles from anon;
grant select (
  id, full_name, role, avatar_url, created_at, user_id, display_name, location, bio,
  is_agent, agency_name, updated_at
) on public.profiles to anon;
