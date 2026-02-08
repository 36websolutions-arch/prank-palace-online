-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter_subscribers(is_active);

-- RLS: service-role can insert/update, no public read
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on newsletter_subscribers"
    ON public.newsletter_subscribers
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Allow anon inserts (for signup forms)
CREATE POLICY "Anon can subscribe"
    ON public.newsletter_subscribers
    FOR INSERT
    WITH CHECK (true);

-- Forum Economicus articles
CREATE TABLE IF NOT EXISTS public.forum_economicus_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Original article data
    original_title TEXT NOT NULL,
    original_url TEXT NOT NULL,
    original_source TEXT,
    original_published_at TIMESTAMP WITH TIME ZONE,
    -- API tracking
    api_source TEXT NOT NULL CHECK (api_source IN ('finnhub', 'alpha_vantage', 'gnews')),
    url_hash TEXT UNIQUE NOT NULL,
    -- Roman transformation
    roman_title TEXT NOT NULL,
    roman_summary TEXT NOT NULL,
    roman_category TEXT NOT NULL CHECK (roman_category IN ('denarii_report', 'oracle_dispatches', 'senate_decrees', 'merchant_affairs', 'forum_gossip')),
    roman_characters TEXT[] DEFAULT '{}',
    sentiment TEXT CHECK (sentiment IN ('favorable', 'ominous', 'neutral')),
    -- Metadata
    ticker_symbols TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_articles_category ON public.forum_economicus_articles(roman_category);
CREATE INDEX IF NOT EXISTS idx_forum_articles_source ON public.forum_economicus_articles(api_source);
CREATE INDEX IF NOT EXISTS idx_forum_articles_published ON public.forum_economicus_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_forum_articles_created ON public.forum_economicus_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_articles_hash ON public.forum_economicus_articles(url_hash);

-- RLS
ALTER TABLE public.forum_economicus_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published forum articles"
    ON public.forum_economicus_articles
    FOR SELECT
    USING (is_published = true);

CREATE POLICY "Service role full access on forum articles"
    ON public.forum_economicus_articles
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Forum Economicus fetch log
CREATE TABLE IF NOT EXISTS public.forum_economicus_fetch_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_source TEXT NOT NULL,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    articles_fetched INTEGER DEFAULT 0,
    articles_new INTEGER DEFAULT 0,
    error TEXT
);

CREATE INDEX IF NOT EXISTS idx_fetch_log_source ON public.forum_economicus_fetch_log(api_source);
CREATE INDEX IF NOT EXISTS idx_fetch_log_time ON public.forum_economicus_fetch_log(fetched_at DESC);

ALTER TABLE public.forum_economicus_fetch_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on fetch log"
    ON public.forum_economicus_fetch_log
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Allow public read on fetch log (for admin display)
CREATE POLICY "Public read fetch log"
    ON public.forum_economicus_fetch_log
    FOR SELECT
    USING (true);
