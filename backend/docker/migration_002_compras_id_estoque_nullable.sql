-- Migration 002: Make id_estoque nullable in compras table
-- The Compra entity does not manage Estoque directly.
-- Each item_compra already links to alimento, making a single
-- id_estoque per compra unnecessary and causing NOT NULL violations.

ALTER TABLE compras ALTER COLUMN id_estoque DROP NOT NULL;
