-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    department TEXT,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'reviewer', 'submitter', 'viewer')),
    avatar_url TEXT
);

-- Create technologies table
CREATE TABLE public.technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tech_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'in-review')),
    tags TEXT[] DEFAULT '{}',
    owner TEXT NOT NULL,
    grid_layer TEXT,
    benefits TEXT
);

-- Create intake_submissions table
CREATE TABLE public.intake_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'approved', 'rejected')),
    submitter_name TEXT NOT NULL,
    submitter_email TEXT NOT NULL,
    submitter_department TEXT NOT NULL,
    grid_layer TEXT,
    benefits TEXT,
    vendors TEXT,
    feasibility_score INTEGER CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
    reviewer_notes TEXT
);

-- Create pilots table
CREATE TABLE public.pilots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    pilot_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    technology_id TEXT,
    phase TEXT NOT NULL DEFAULT 'initiation' CHECK (phase IN ('initiation', 'planning', 'execution', 'completed', 'pipeline')),
    status TEXT NOT NULL,
    sponsor TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    objectives TEXT NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    lessons_learned TEXT
);

-- Create market_watchlist table
CREATE TABLE public.market_watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    watchlist_id TEXT NOT NULL UNIQUE,
    technology TEXT NOT NULL,
    vendor TEXT,
    signal TEXT NOT NULL DEFAULT 'monitoring' CHECK (signal IN ('emerging', 'monitoring', 'mature')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    notes TEXT
);

-- Create vendors table
CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vendor_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    focus TEXT NOT NULL,
    maturity TEXT NOT NULL DEFAULT 'growth' CHECK (maturity IN ('early', 'growth', 'mature')),
    region TEXT NOT NULL,
    active_pilots INTEGER DEFAULT 0,
    related_technologies TEXT[] DEFAULT '{}'
);

-- Create industry_insights table
CREATE TABLE public.industry_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    insight_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    date DATE NOT NULL,
    summary TEXT NOT NULL,
    url TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_technologies_status ON public.technologies(status);
CREATE INDEX idx_technologies_tech_id ON public.technologies(tech_id);
CREATE INDEX idx_intake_submissions_status ON public.intake_submissions(status);
CREATE INDEX idx_intake_submissions_submission_id ON public.intake_submissions(submission_id);
CREATE INDEX idx_pilots_phase ON public.pilots(phase);
CREATE INDEX idx_pilots_pilot_id ON public.pilots(pilot_id);
CREATE INDEX idx_market_watchlist_priority ON public.market_watchlist(priority);
CREATE INDEX idx_vendors_vendor_id ON public.vendors(vendor_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON public.technologies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intake_submissions_updated_at BEFORE UPDATE ON public.intake_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pilots_updated_at BEFORE UPDATE ON public.pilots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_watchlist_updated_at BEFORE UPDATE ON public.market_watchlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_industry_insights_updated_at BEFORE UPDATE ON public.industry_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for technologies (all authenticated users can read)
CREATE POLICY "Authenticated users can view technologies" ON public.technologies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and reviewers can insert technologies" ON public.technologies
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

CREATE POLICY "Admins and reviewers can update technologies" ON public.technologies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

CREATE POLICY "Admins can delete technologies" ON public.technologies
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for intake_submissions
CREATE POLICY "Users can view all submissions" ON public.intake_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert submissions" ON public.intake_submissions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins and reviewers can update submissions" ON public.intake_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

-- RLS Policies for pilots
CREATE POLICY "Users can view all pilots" ON public.pilots
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and reviewers can manage pilots" ON public.pilots
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

-- RLS Policies for market_watchlist
CREATE POLICY "Users can view watchlist" ON public.market_watchlist
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and reviewers can manage watchlist" ON public.market_watchlist
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

-- RLS Policies for vendors
CREATE POLICY "Users can view vendors" ON public.vendors
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and reviewers can manage vendors" ON public.vendors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

-- RLS Policies for industry_insights
CREATE POLICY "Users can view insights" ON public.industry_insights
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and reviewers can manage insights" ON public.industry_insights
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
        )
    );

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        'viewer'  -- Default role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
