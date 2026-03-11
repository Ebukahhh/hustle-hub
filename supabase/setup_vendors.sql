-- Create the vendors table
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    vendor_type TEXT NOT NULL CHECK (vendor_type IN ('PU Student', 'External Vendor')),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    student_id TEXT,
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL CHECK (industry IN (
        'Fashion & Apparel', 
        'Food & Snacks', 
        'Beauty & Cosmetics', 
        'Technology / Digital Services', 
        'Arts & Crafts', 
        'Other'
    )),
    description TEXT NOT NULL,
    social_handles TEXT,
    stand_type TEXT NOT NULL CHECK (stand_type IN (
        'Standard Table Stand', 
        'Double Table Stand', 
        'Space Only (Self-setup)'
    )),
    electricity_needed BOOLEAN NOT NULL DEFAULT false,
    large_equipment TEXT,
    amount_due NUMERIC NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed')),
    reference_id TEXT
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Allow insert access to anyone
CREATE POLICY "Allow public insert to vendors" ON public.vendors
    FOR INSERT WITH CHECK (true);

-- Allow select access (e.g. to verify payment)
CREATE POLICY "Allow public select on vendors" ON public.vendors
    FOR SELECT USING (true);
