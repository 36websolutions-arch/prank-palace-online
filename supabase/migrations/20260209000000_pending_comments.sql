-- Pending comments for Chronicle Commenter review pipeline
CREATE TABLE IF NOT EXISTS public.pending_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL,
    post_id TEXT NOT NULL,
    post_url TEXT,
    post_text TEXT,
    post_author TEXT,
    post_likes INTEGER DEFAULT 0,
    comment_text TEXT NOT NULL,
    search_query TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'posted', 'failed')),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    posted_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (platform, post_id)
);

CREATE INDEX IF NOT EXISTS idx_pending_comments_status ON public.pending_comments(status);
CREATE INDEX IF NOT EXISTS idx_pending_comments_platform ON public.pending_comments(platform);
CREATE INDEX IF NOT EXISTS idx_pending_comments_created ON public.pending_comments(created_at DESC);

-- RLS
ALTER TABLE public.pending_comments ENABLE ROW LEVEL SECURITY;

-- Service role (chronicle-commenter bot) gets full access
CREATE POLICY "Service role full access on pending_comments"
    ON public.pending_comments
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Admins can read and update (approve/reject from dashboard)
CREATE POLICY "Admins can read pending_comments"
    ON public.pending_comments
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pending_comments"
    ON public.pending_comments
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
