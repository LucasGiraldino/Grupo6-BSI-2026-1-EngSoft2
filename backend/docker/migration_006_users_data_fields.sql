-- Migration 006: Add data_nascimento, telefone, and id_endereco to users table

ALTER TABLE users ADD COLUMN data_nascimento DATE;
ALTER TABLE users ADD COLUMN telefone VARCHAR(20);
ALTER TABLE users ADD COLUMN id_endereco INTEGER REFERENCES enderecos(id_endereco);
