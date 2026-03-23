-- Migration: Add shared stand fields to vendors table
-- Run this in Supabase SQL Editor before deploying frontend changes

-- 1. Update the stand_type CHECK constraint to include 'Share a Stand'
ALTER TABLE public.vendors
  DROP CONSTRAINT IF EXISTS vendors_stand_type_check;

ALTER TABLE public.vendors
  ADD CONSTRAINT vendors_stand_type_check
  CHECK (stand_type IN (
    'Standard Table Stand',
    'Share a Stand',
    -- Keep legacy values so existing records don't break
    'Double Table Stand',
    'Space Only (Self-setup)'
  ));

-- 2. Add partner linking and labeling fields
ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS stand_partner_id UUID REFERENCES public.vendors(id),
  ADD COLUMN IF NOT EXISTS stand_label TEXT CHECK (stand_label IN ('A', 'B')),
  ADD COLUMN IF NOT EXISTS stand_number TEXT;
