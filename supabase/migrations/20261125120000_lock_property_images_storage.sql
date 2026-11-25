-- Lock down the property-images bucket.
--
-- 1. "Allow authenticated uploads 107eh68_0" let any signed-in user upload
--    anywhere in the bucket. Policies are OR'd, so it overrode the per-user
--    rule. Uploads now go only into the uploader's own folder ({sub}/...),
--    which is what app/add/page.tsx already does ("Allow authenticated uploads").
-- 2. "Allow public read 107eh68_0" let anyone list every file in the bucket.
--    The bucket is public, so photo links still work without it; signed-in
--    users can still see their own folder ("Allow authenticated select").

drop policy if exists "Allow authenticated uploads 107eh68_0" on storage.objects;
drop policy if exists "Allow public read 107eh68_0" on storage.objects;
