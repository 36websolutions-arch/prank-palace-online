-- Raise caption-videos bucket limit so 1.5+ min iPhone videos upload cleanly
-- Default Supabase bucket cap is 50MB; that blocks anything beyond ~30s of 1080p
UPDATE storage.buckets
SET file_size_limit = 500 * 1024 * 1024  -- 500MB
WHERE id = 'caption-videos';
