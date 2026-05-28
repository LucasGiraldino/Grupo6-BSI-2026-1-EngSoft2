-- SIGAAC Database Initialization Script
-- PostgreSQL DDL for SIGAAC database

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Level 0: sem dependências
CREATE TABLE enderecos (
    id_endereco INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    pais VARCHAR(50) NOT NULL DEFAULT 'Brasil',
    complemento VARCHAR(100),
    descricao TEXT
);

CREATE TABLE categorias_alimentos (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE tipos_exame (
    id_tipo_exame INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Level 1: depende de enderecos
CREATE TABLE parametrizacao_ong (
    id_parametrizacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    razao_social VARCHAR(150) NOT NULL,
    nome_fantasia VARCHAR(150),
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(150),
    site VARCHAR(150),
    id_endereco INTEGER REFERENCES enderecos(id_endereco),
    logo_url VARCHAR(255),
    data_fundacao DATE,
    observacoes TEXT
);

-- Level 2: depende de parametrizacao_ong
CREATE TABLE users (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL,
    data_cadastro DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    id_parametrizacao INTEGER REFERENCES parametrizacao_ong(id_parametrizacao),
    totp_secret VARCHAR(255),
    totp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    data_nascimento DATE,
    telefone VARCHAR(20),
    id_endereco INTEGER REFERENCES enderecos(id_endereco),
    deleted_at TIMESTAMP
);

-- Level 2: depende de enderecos
CREATE TABLE pacientes (
    id_paciente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_endereco INTEGER REFERENCES enderecos(id_endereco),
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo VARCHAR(10) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(150),
    restricoes_alimentares TEXT,
    data_cadastro DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP
);

CREATE TABLE alimentos (
    id_alimento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria INTEGER NOT NULL REFERENCES categorias_alimentos(id_categoria),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    unidade_medida VARCHAR(20) NOT NULL,
    data_vencimento DATE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP
);

-- Level 3: depende de users + enderecos
CREATE TABLE profissionais (
    id_profissional INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE REFERENCES users(id_usuario),
    id_endereco INTEGER REFERENCES enderecos(id_endereco),
    especialidade VARCHAR(100) NOT NULL,
    registro_profissional VARCHAR(50),
    data_admissao DATE NOT NULL,
    data_demissao DATE
);

CREATE TABLE medicos (
    id_medico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE REFERENCES users(id_usuario),
    id_endereco INTEGER REFERENCES enderecos(id_endereco),
    crm VARCHAR(20) NOT NULL UNIQUE,
    especialidade_medica VARCHAR(100) NOT NULL,
    data_admissao DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP
);

CREATE TABLE agenda (
    id_agenda INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES users(id_usuario),
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE estoque (
    id_estoque INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alimento INTEGER NOT NULL UNIQUE REFERENCES alimentos(id_alimento),
    quantidade_atual NUMERIC(10,3) NOT NULL DEFAULT 0,
    quantidade_minima NUMERIC(10,3) NOT NULL DEFAULT 0,
    data_ultima_atualizacao TIMESTAMP NOT NULL
);

-- Level 4: depende de medicos, users, pacientes
CREATE TABLE prontuarios (
    id_prontuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_medico INTEGER REFERENCES medicos(id_medico),
    id_usuario INTEGER REFERENCES users(id_usuario),
    id_paciente INTEGER REFERENCES pacientes(id_paciente),
    data_abertura DATE NOT NULL,
    data_fechamento DATE,
    observacoes_gerais TEXT
);

CREATE TABLE triagens (
    id_triagem INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prontuario INTEGER NOT NULL REFERENCES prontuarios(id_prontuario),
    id_medico INTEGER NOT NULL REFERENCES medicos(id_medico),
    data_triagem TIMESTAMP NOT NULL,
    pressao_arterial VARCHAR(20),
    febre NUMERIC(4,1),
    condicao_clinica TEXT NOT NULL,
    condicao_nutricional TEXT,
    condicao_social TEXT,
    observacoes TEXT,
    deleted_at TIMESTAMP
);

CREATE TABLE consultas (
    id_consulta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER REFERENCES pacientes(id_paciente),
    id_agenda INTEGER REFERENCES agenda(id_agenda),
    id_profissional INTEGER REFERENCES profissionais(id_profissional),
    tipo_consulta VARCHAR(50) NOT NULL CHECK (tipo_consulta IN ('CONSULTA', 'URGENCIA', 'RETORNO', 'Triagem')),
    status VARCHAR(20) NOT NULL,
    observacoes TEXT,
    data_agendamento TIMESTAMP NOT NULL,
    data_cancelamento TIMESTAMP,
    id_triagem INTEGER REFERENCES triagens(id_triagem)
);

CREATE TABLE compras (
    id_compra INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_estoque INTEGER REFERENCES estoque(id_estoque),
    data_compra TIMESTAMP NOT NULL,
    observacoes TEXT
);

CREATE TABLE doacoes (
    id_doacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_profissional INTEGER NOT NULL REFERENCES profissionais(id_profissional),
    id_paciente INTEGER NOT NULL REFERENCES pacientes(id_paciente),
    id_estoque INTEGER REFERENCES estoque(id_estoque),
    data_doacao TIMESTAMP NOT NULL,
    observacoes TEXT
);

CREATE TABLE notificacoes (
    id_notificacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL REFERENCES pacientes(id_paciente),
    tipo VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    data_envio TIMESTAMP NOT NULL,
    status_envio VARCHAR(20) NOT NULL
);

-- Level 5: depende de prontuarios
CREATE TABLE itens_prontuario (
    id_item_prontuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prontuario INTEGER NOT NULL REFERENCES prontuarios(id_prontuario),
    tipo_item VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_registro TIMESTAMP NOT NULL,
    id_usuario INTEGER NOT NULL REFERENCES users(id_usuario)
);

CREATE TABLE evolucoes_clinicas (
    id_evolucao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prontuario INTEGER NOT NULL REFERENCES prontuarios(id_prontuario),
    id_usuario INTEGER NOT NULL REFERENCES users(id_usuario),
    id_profissional INTEGER REFERENCES profissionais(id_profissional),
    data_registro TIMESTAMP NOT NULL,
    setor VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE receitas_medicas (
    id_receita INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prontuario INTEGER NOT NULL REFERENCES prontuarios(id_prontuario),
    id_medico INTEGER NOT NULL REFERENCES medicos(id_medico),
    data_emissao TIMESTAMP NOT NULL,
    descricao TEXT NOT NULL,
    data_validade DATE NOT NULL
);

CREATE TABLE exames (
    id_exame INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prontuario INTEGER NOT NULL REFERENCES prontuarios(id_prontuario),
    id_medico INTEGER NOT NULL REFERENCES medicos(id_medico),
    id_tipo_exame INTEGER NOT NULL REFERENCES tipos_exame(id_tipo_exame),
    justificativa_clinica TEXT NOT NULL,
    data_solicitacao TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    observacoes_medico TEXT,
    data_realizacao DATE,
    deleted_at TIMESTAMP
);

CREATE TABLE itens_compra (
    id_item_compra INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_compra INTEGER NOT NULL REFERENCES compras(id_compra),
    id_alimento INTEGER NOT NULL REFERENCES alimentos(id_alimento),
    quantidade NUMERIC(10,3) NOT NULL,
    preco NUMERIC(10,2) NOT NULL
);

CREATE TABLE itens_doacao (
    id_item_doacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_doacao INTEGER NOT NULL REFERENCES doacoes(id_doacao) ON DELETE CASCADE,
    id_alimento INTEGER NOT NULL REFERENCES alimentos(id_alimento),
    quantidade NUMERIC(10,3) NOT NULL,
    peso NUMERIC(10,3)
);

CREATE TABLE profissionais_compras (
    id_profissional INTEGER NOT NULL REFERENCES profissionais(id_profissional),
    id_compra INTEGER NOT NULL REFERENCES compras(id_compra),
    PRIMARY KEY (id_profissional, id_compra)
);

-- Partial unique indexes (allow reusing CPF/email from soft-deleted records)
CREATE UNIQUE INDEX uq_pacientes_cpf_ativo ON pacientes (cpf) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_users_cpf_ativo ON users (cpf) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_users_email_ativo ON users (email) WHERE deleted_at IS NULL;