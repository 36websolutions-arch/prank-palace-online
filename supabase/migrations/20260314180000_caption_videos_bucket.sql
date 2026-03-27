-- Create storage bucket for caption video uploads (temporary, deleted after processing)
INSERT INTO storage.buckets (id, name, public) VALUES ('caption-videos', 'caption-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload videos for caption generation
DO $$ BEGIN
CREATE POLICY "Authenticated users can upload caption videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'caption-videos');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Service role can read videos for transcription (edge function)
DO $$ BEGIN
CREATE POLICY "Service role can read caption videos"
ON storage.objects FOR SELECT TO service_role
USING (bucket_id = 'caption-videos');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Service role can delete videos after processing (edge function cleanup)
DO $$ BEGIN
CREATE POLICY "Service role can delete caption videos"
ON storage.objects FOR DELETE TO service_role
USING (bucket_id = 'caption-videos');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
