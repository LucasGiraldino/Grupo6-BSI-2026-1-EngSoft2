-- Migration 004: Add deleted_at column to alimentos table
-- The Alimento model uses soft-delete (deleted_at IS NULL queries, delete() sets deleted_at = NOW())
-- but the column was missing from the DDL.

ALTER TABLE alimentos ADD COLUMN deleted_at TIMESTAMP;
