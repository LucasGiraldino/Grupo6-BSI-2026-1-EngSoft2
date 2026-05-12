-- Migration 001: Replace UNIQUE(cpf) with partial unique indexes
-- to allow reusing CPFs from soft-deleted records.

-- Make id_medico and id_usuario nullable in prontuarios
-- (auto-created prontuarios at patient registration don't have a doctor/user)
ALTER TABLE prontuarios ALTER COLUMN id_medico DROP NOT NULL;
ALTER TABLE prontuarios ALTER COLUMN id_usuario DROP NOT NULL;

-- Add deleted_at column if missing (for setups that predate soft-delete)
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Drop UNIQUE(cpf) on pacientes, replace with partial unique index
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT con.conname INTO con_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'pacientes'
    AND con.contype = 'u'
    AND EXISTS (
      SELECT 1 FROM pg_attribute att
      WHERE att.attrelid = con.conrelid AND att.attname = 'cpf'
        AND att.attnum = ANY(con.conkey)
    );
  IF con_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE pacientes DROP CONSTRAINT ' || con_name;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_pacientes_cpf_ativo
  ON pacientes (cpf) WHERE deleted_at IS NULL;

-- Drop UNIQUE(cpf) on users, replace with partial unique index
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT con.conname INTO con_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'users'
    AND con.contype = 'u'
    AND EXISTS (
      SELECT 1 FROM pg_attribute att
      WHERE att.attrelid = con.conrelid AND att.attname = 'cpf'
        AND att.attnum = ANY(con.conkey)
    );
  IF con_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE users DROP CONSTRAINT ' || con_name;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_cpf_ativo
  ON users (cpf) WHERE deleted_at IS NULL;

-- Drop UNIQUE(email) on users, replace with partial unique index
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT con.conname INTO con_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'users'
    AND con.contype = 'u'
    AND EXISTS (
      SELECT 1 FROM pg_attribute att
      WHERE att.attrelid = con.conrelid AND att.attname = 'email'
        AND att.attnum = ANY(con.conkey)
    );
  IF con_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE users DROP CONSTRAINT ' || con_name;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email_ativo
  ON users (email) WHERE deleted_at IS NULL;
