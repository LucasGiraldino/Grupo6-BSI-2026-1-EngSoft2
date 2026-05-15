-- Migration 005: Make id_estoque nullable in doacoes table
-- The Doacao entity does not manage Estoque directly.
-- Donation items (itens_doacao) already link to alimento, making a single
-- id_estoque per doacao unnecessary and causing NOT NULL violations.

ALTER TABLE doacoes ALTER COLUMN id_estoque DROP NOT NULL;
