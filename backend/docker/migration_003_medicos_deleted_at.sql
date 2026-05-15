-- Migration 003: Add deleted_at column to medicos table
-- Medico model uses soft-delete (deleted_at IS NULL in queries, delete() sets deleted_at = NOW())
-- but the column was missing from the DDL.

ALTER TABLE medicos ADD COLUMN deleted_at TIMESTAMP;
