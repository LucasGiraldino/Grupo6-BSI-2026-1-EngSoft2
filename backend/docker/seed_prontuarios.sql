-- ================================================================
-- Script de Seed para Teste - Prontuários e Dependências
-- Banco: PostgreSQL (compatível com init.sql + migrações)
-- ================================================================
-- ATENÇÃO: Execute apenas em banco vazio ou após o seed do DataInitializer
-- Se o DataInitializer já rodou, os INSERTs vão conflitar (CPF/CRM duplicados).
-- Neste caso, comente os blocos de enderecos/users/medicos/pacientes/tipos_exame
-- e mantenha apenas os inserts a partir de prontuarios (usando IDs reais do banco).
-- ================================================================

BEGIN;

-- ================================================================
-- NÍVEL 0: Sem dependências
-- ================================================================

-- ENDEREÇOS
INSERT INTO enderecos (id_endereco, cep, logradouro, numero, bairro, cidade, estado, pais, complemento)
OVERRIDING SYSTEM VALUE VALUES
(1, '01001000', 'Rua das Flores',    '100', 'Centro',      'São Paulo', 'SP', 'Brasil', 'Apto 41'),
(2, '02002000', 'Av. Paulista',      '500', 'Bela Vista',  'São Paulo', 'SP', 'Brasil', NULL),
(3, '03003000', 'Rua da Consolação', '200', 'Consolação',  'São Paulo', 'SP', 'Brasil', 'Casa 2'),
(4, '04004000', 'Rua Augusta',       '800', 'Cerqueira César', 'São Paulo', 'SP', 'Brasil', NULL),
(5, '05005000', 'Alameda Santos',    '300', 'Jardins',     'São Paulo', 'SP', 'Brasil', NULL);

-- TIPOS DE EXAME
INSERT INTO tipos_exame (id_tipo_exame, nome, descricao, ativo)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Hemograma Completo',  'Avalia glóbulos vermelhos, brancos e plaquetas', TRUE),
(2, 'Raio-X',              'Imagem radiológica de tórax, ossos e articulações', TRUE),
(3, 'Ultrassom',           'Imagem por ultrassonografia abdominal e pélvica', TRUE),
(4, 'Eletrocardiograma',   'Avaliação da atividade elétrica do coração', TRUE),
(5, 'Glicemia em Jejum',   'Dosagem de glicose no sangue após jejum', TRUE);

-- ================================================================
-- NÍVEL 1: depende de enderecos
-- ================================================================

INSERT INTO parametrizacao_ong (id_parametrizacao, razao_social, nome_fantasia, cnpj, telefone, email, site, id_endereco)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Associação Beneficente SIGAAC', 'SIGAAC', '12345678000199', '11999990001', 'contato@sigaac.org', 'https://sigaac.org', 1);

-- ================================================================
-- NÍVEL 2: depende de parametrizacao_ong / enderecos
-- ================================================================

-- USERS (sem o admin admin@sigaac.com)
-- senha_hash = BCrypt de "123456"
-- Novas colunas (migration 006): data_nascimento, telefone, id_endereco
INSERT INTO users (id_usuario, nome, cpf, email, senha_hash, perfil, data_cadastro, ativo, failed_attempts, id_parametrizacao, totp_enabled, data_nascimento, telefone, id_endereco)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Dr. Carlos Silva',   '22222222222', 'carlos.silva@sigaac.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USUARIO', CURRENT_DATE, TRUE, 0, 1, FALSE,
 '1980-05-12', '11988880001', 2),
(2, 'Dra. Ana Oliveira',  '33333333333', 'ana.oliveira@sigaac.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USUARIO', CURRENT_DATE, TRUE, 0, 1, FALSE,
 '1985-09-23', '11988880002', 3),
(3, 'Dr. Pedro Santos',   '44444444444', 'pedro.santos@sigaac.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USUARIO', CURRENT_DATE, TRUE, 0, 1, FALSE,
 '1990-01-08', '11988880003', 4);

-- PACIENTES
INSERT INTO pacientes (id_paciente, id_endereco, nome, cpf, data_nascimento, sexo, telefone, email, restricoes_alimentares, data_cadastro, ativo)
OVERRIDING SYSTEM VALUE VALUES
(1, 2, 'Maria Aparecida Souza',  '12345678901', '1985-03-15', 'FEMININO',  '11911111111', 'maria.souza@email.com',  'Nenhuma',                      CURRENT_DATE, TRUE),
(2, 3, 'João Antonio Pereira',   '23456789012', '1978-07-22', 'MASCULINO', '11922222222', 'joao.pereira@email.com', 'Intolerância à lactose',        CURRENT_DATE, TRUE),
(3, 4, 'Lucia Helena Santos',    '34567890123', '1992-11-08', 'FEMININO',  '11933333333', 'lucia.santos@email.com', 'Nenhuma',                      CURRENT_DATE, TRUE),
(4, 5, 'Pedro Henrique Costa',   '45678901234', '2000-01-30', 'MASCULINO', '11944444444', 'pedro.costa@email.com',  'Dieta sem glúten',             CURRENT_DATE, TRUE),
(5, 1, 'Dona Rosa Maria Lima',   '56789012345', '1950-06-10', 'FEMININO',  '11955555555', 'rosa.lima@email.com',    'Hipertensa — dieta com pouco sódio', CURRENT_DATE, TRUE);

-- ================================================================
-- NÍVEL 3: depende de users + enderecos
-- ================================================================

-- MÉDICOS
INSERT INTO medicos (id_medico, id_usuario, id_endereco, crm, especialidade_medica, data_admissao, ativo)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 2, '12345-SP', 'Clínico Geral',  '2023-01-15', TRUE),
(2, 2, 3, '67890-SP', 'Cardiologista',  '2023-02-01', TRUE),
(3, 3, 4, '11111-SP', 'Pediatra',       '2024-03-10', TRUE);

-- PROFISSIONAIS
INSERT INTO profissionais (id_profissional, id_usuario, id_endereco, especialidade, registro_profissional, data_admissao)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 2, 'Clínico Geral', '12345-SP', '2023-01-15'),
(2, 2, 3, 'Cardiologista', '67890-SP', '2023-02-01'),
(3, 3, 4, 'Pediatra',      '11111-SP', '2024-03-10');

-- ================================================================
-- NÍVEL 4: PRONTUÁRIOS
-- ================================================================
-- id_usuario = 1 (Dr. Carlos) — responsável por abrir o prontuário no sistema

INSERT INTO prontuarios (id_prontuario, id_medico, id_usuario, id_paciente, data_abertura, data_fechamento, observacoes_gerais)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 1, '2025-11-20', NULL,
 'Paciente relatou dores de cabeça frequentes e tontura. Histórico familiar de hipertensão.'),
(2, 1, 1, 2, '2025-12-05', NULL,
 'Paciente com suspeita de gastrite. Queimação epigástrica há 2 semanas.'),
(3, 2, 1, 3, '2026-01-10', NULL,
 'Paciente com palpitações e falta de ar aos esforços. Solicita avaliação cardiológica.'),
(4, 3, 1, 4, '2026-02-18', NULL,
 'Paciente jovem, exame periódico de rotina. Sem queixas específicas.'),
(5, 2, 1, 5, '2026-03-01', NULL,
 'Paciente idosa, hipertensa, em acompanhamento. Última consulta: pressão alterada (150x95).');

-- ================================================================
-- NÍVEL 5: Filhas de prontuarios
-- ================================================================

-- TRIAGENS
INSERT INTO triagens (id_triagem, id_prontuario, id_medico, data_triagem, pressao_arterial, febre, condicao_clinica, condicao_nutricional, condicao_social, observacoes)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, '2025-11-20 09:30:00', '130x85', 36.5,
 'Paciente consciente, orientada, eupneica. Cefaleia frontal. PA levemente elevada.',
 'Peso adequado para idade. Sem sinais de desnutrição.',
 'Reside com familiares. Mora em casa com saneamento básico.',
 'Aguardando resultado de exames.'),
(2, 2, 1, '2025-12-05 14:00:00', '120x80', 37.0,
 'Paciente consciente, queixa de pirose e dor epigástrica. Abdômen doloroso à palpação superficial.',
 'Sobrepeso leve. Orientado a reduzir alimentos gordurosos.',
 'Trabalha com vendas, alta carga de estresse.',
 'Solicitado endoscopia para confirmação.'),
(3, 3, 2, '2026-01-10 10:15:00', '135x90', 36.8,
 'Paciente relata palpitações intermitentes e dispneia. Sopro cardíaco auscultado.',
 'Peso normal. Dieta balanceada.',
 'Reside sozinha, nega tabagismo ou etilismo.',
 'ECG solicitado com urgência.');

-- ITENS DE PRONTUÁRIO
INSERT INTO itens_prontuario (id_item_prontuario, id_prontuario, tipo_item, descricao, data_registro, id_usuario)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'EVOLUCAO',   'Primeira consulta: anamnese completa realizada.',                 '2025-11-20 09:20:00', 1),
(2, 1, 'EXAME',      'Solicitado hemograma completo e glicemia em jejum.',              '2025-11-20 09:35:00', 1),
(3, 2, 'EVOLUCAO',   'Paciente orientado sobre dieta e medicação para gastrite.',        '2025-12-05 14:10:00', 1),
(4, 3, 'EXAME',      'Solicitado eletrocardiograma e ecocardiograma.',                   '2026-01-10 10:20:00', 2),
(5, 4, 'EVOLUCAO',   'Exame físico sem alterações. Paciente liberado.',                  '2026-02-18 11:00:00', 3),
(6, 5, 'EVOLUCAO',   'Ajuste de medicação anti-hipertensiva. Retorno em 30 dias.',       '2026-03-01 08:45:00', 2);

-- EVOLUÇÕES CLÍNICAS
INSERT INTO evolucoes_clinicas (id_evolucao, id_prontuario, id_usuario, id_profissional, data_registro, setor, descricao)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 1, '2025-11-25 10:00:00', 'CLINICA_MEDICA',
 'Retorno para resultado de exames. Hemograma normal. Glicemia: 98 mg/dL (normal). PA: 125x80. Mantém conduta.'),
(2, 1, 1, 1, '2025-12-10 09:30:00', 'CLINICA_MEDICA',
 'Paciente relata melhora da cefaleia após início de dieta com baixo sódio. PA controlada: 120x80.'),
(3, 2, 1, 1, '2025-12-20 14:00:00', 'AMBULATORIO',
 'Endoscopia realizada: gastrite enantematosa leve. Prescrito omeprazol 20mg por 30 dias.'),
(4, 3, 2, 2, '2026-01-20 11:00:00', 'CARDIOLOGIA',
 'ECG mostra taquicardia sinusal. Ecocardiograma com fração de ejeção preservada. Iniciado betabloqueador.'),
(5, 5, 2, 2, '2026-03-15 08:30:00', 'CARDIOLOGIA',
 'PA: 130x85. Relata tontura com a nova medicação. Ajustada dosagem. Retorno em 15 dias.');

-- RECEITAS MÉDICAS
INSERT INTO receitas_medicas (id_receita, id_prontuario, id_medico, data_emissao, descricao, data_validade)
OVERRIDING SYSTEM VALUE VALUES
(1, 2, 1, '2025-12-05 14:30:00',
 'Omeprazol 20mg — 1 cápsula em jejum por 30 dias.\nDomperidona 10mg — 1 comprimido 3x/dia por 15 dias.',
 '2026-06-05'),
(2, 3, 2, '2026-01-20 11:30:00',
 'Propranolol 40mg — 1 comprimido 2x/dia.\nAAS 100mg — 1 comprimido 1x/dia após almoço.',
 '2026-07-20'),
(3, 5, 2, '2026-03-01 09:00:00',
 'Losartana 50mg — 1 comprimido 1x/dia.\nHidroclorotiazida 25mg — 1 comprimido 1x/dia pela manhã.',
 '2026-09-01'),
(4, 1, 1, '2025-11-20 09:40:00',
 'Dipirona 500mg — 1 comprimido a cada 6h se dor (máx 3 dias).',
 '2026-05-20');

-- EXAMES
INSERT INTO exames (id_exame, id_prontuario, id_medico, id_tipo_exame, justificativa_clinica, data_solicitacao, status, observacoes_medico, data_realizacao)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 1, 'Avaliação inicial com cefaleia e tontura. Descartar anemia.',                '2025-11-20 09:30:00', 'REALIZADO', 'Hb 13.2 — normal. Leucócitos normais.',  '2025-11-22'),
(2, 1, 1, 5, 'Rastreio de diabetes devido histórico familiar.',                             '2025-11-20 09:30:00', 'REALIZADO', 'Glicemia: 98 mg/dL — normal.',            '2025-11-22'),
(3, 3, 2, 4, 'Palpitações e taquicardia. Avaliar ritmo cardíaco.',                          '2026-01-10 10:25:00', 'REALIZADO', 'Taquicardia sinusal — 105 bpm.',          '2026-01-12'),
(4, 3, 2, 3, 'Dispneia aos esforços. Avaliar função cardíaca estrutural.',                  '2026-01-10 10:25:00', 'AGENDADO', NULL,                                          NULL),
(5, 5, 2, 4, 'Acompanhamento de hipertensão. Controle periódico.',                          '2026-03-01 08:50:00', 'SOLICITADO', NULL,                                        NULL);

-- ================================================================
-- FIM
-- ================================================================

COMMIT;
