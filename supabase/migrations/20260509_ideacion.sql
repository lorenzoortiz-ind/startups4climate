-- Migration: Módulo 00 Ideación
-- Date: 2026-05-09

-- ── 1. Add stage column to cohorts ──────────────────────────────────────────
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS stage text
  CHECK (stage IN (
    'ideacion',
    'pre-incubacion',
    'incubacion',
    'aceleracion',
    'escalamiento'
  ));

-- ── 2. Migrate profiles.stage numeric strings → semantic names ───────────────
-- Also handles legacy 'pre_incubation' (underscore) → 'pre-incubacion'
UPDATE profiles
SET stage = CASE
  WHEN stage = '1' THEN 'pre-incubacion'
  WHEN stage = '2' THEN 'incubacion'
  WHEN stage = '3' THEN 'aceleracion'
  WHEN stage = '4' THEN 'escalamiento'
  WHEN stage = 'pre_incubation' THEN 'pre-incubacion'
  ELSE stage
END
WHERE stage IN ('1', '2', '3', '4', 'pre_incubation');

-- ── 3. Add check constraint on profiles.stage including 'ideacion' ───────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_stage_check' AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_stage_check;
  END IF;
END $$;

ALTER TABLE profiles ADD CONSTRAINT profiles_stage_check
  CHECK (stage IN (
    'ideacion',
    'pre-incubacion',
    'incubacion',
    'aceleracion',
    'escalamiento'
  ) OR stage IS NULL);
