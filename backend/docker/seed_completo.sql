-- ================================================================
-- Script de Seed Completo - TODAS as 23 tabelas
-- Banco: PostgreSQL (compatível com init.sql + migration 006)
-- ================================================================
-- Uso: docker compose down -v && docker compose up -d
--      psql -h localhost -p 5432 -U postgres -d sigaac -f seed_completo.sql
-- ================================================================

BEGIN;

-- ================================================================
-- NÍVEL 0: Sem dependências
-- ================================================================

-- CATEGORIAS DE ALIMENTOS
INSERT INTO categorias_alimentos (id_categoria, nome, descricao)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Grãos e Cereais',   'Arroz, feijão, lentilha, milho e derivados'),
(2, 'Hortifrúti',        'Frutas, legumes e verduras in natura');

-- ENDEREÇOS
INSERT INTO enderecos (id_endereco, cep, logradouro, numero, bairro, cidade, estado, pais, complemento)
OVERRIDING SYSTEM VALUE VALUES
(1, '01001000', 'Rua das Flores',    '100', 'Centro',         'São Paulo', 'SP', 'Brasil', 'Apto 41'),
(2, '02002000', 'Av. Paulista',      '500', 'Bela Vista',     'São Paulo', 'SP', 'Brasil', NULL),
(3, '03003000', 'Rua da Consolação', '200', 'Consolação',     'São Paulo', 'SP', 'Brasil', 'Casa 2'),
(4, '04004000', 'Rua Augusta',       '800', 'Cerqueira César','São Paulo', 'SP', 'Brasil', NULL),
(5, '05005000', 'Alameda Santos',    '300', 'Jardins',        'São Paulo', 'SP', 'Brasil', NULL);

-- TIPOS DE EXAME
INSERT INTO tipos_exame (id_tipo_exame, nome, descricao, ativo)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Hemograma Completo',    'Avalia glóbulos vermelhos, brancos e plaquetas', TRUE),
(2, 'Raio-X',                'Imagem radiológica de tórax, ossos e articulações', TRUE),
(3, 'Ultrassom',             'Imagem por ultrassonografia abdominal e pélvica', TRUE),
(4, 'Eletrocardiograma',     'Avaliação da atividade elétrica do coração', TRUE),
(5, 'Glicemia em Jejum',     'Dosagem de glicose no sangue após jejum', TRUE);

-- ================================================================
-- NÍVEL 1: depende de enderecos
-- ================================================================

INSERT INTO parametrizacao_ong (id_parametrizacao, razao_social, nome_fantasia, cnpj, telefone, email, site, id_endereco)
OVERRIDING SYSTEM VALUE VALUES
(1, 'Associação Beneficente SIGAAC', 'SIGAAC', '12345678000199', '11999990001', 'contato@sigaac.org', 'https://sigaac.org', 1);

-- ================================================================
-- NÍVEL 2: depende de parametrizacao_ong / enderecos / categorias
-- ================================================================

-- USERS (admin + 3 médicos)
INSERT INTO users (id_usuario, nome, cpf, email, senha_hash, perfil, data_cadastro, ativo, failed_attempts, id_parametrizacao, totp_enabled, data_nascimento, telefone, id_endereco)
OVERRIDING SYSTEM VALUE VALUES
(1, 'admin',              '49972349829', 'admin@sigaac.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN',   CURRENT_DATE, TRUE, 0, 1, FALSE,
 '2006-11-23', NULL, NULL),
(2, 'Dr. Carlos Silva',  '22222222222', 'carlos.silva@sigaac.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USUARIO', CURRENT_DATE, TRUE, 0, 1, FALSE,
 '1980-05-12', '11988880001', 2),
(3, 'Dra. Ana Oliveira', '33333333333', 'ana.oliveira@sigaac.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USUARIO', CURRENT_DATE, TRUE, 0, 1, FALSE,
 '1985-09-23', '11988880002', 3),
(4, 'Dr. Pedro Santos',  '44444444444', 'pedro.santos@sigaac.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USUARIO', CURRENT_DATE, TRUE, 0, 1, FALSE,
 '1990-01-08', '11988880003', 4);

-- PACIENTES
INSERT INTO pacientes (id_paciente, id_endereco, nome, cpf, data_nascimento, sexo, telefone, email, restricoes_alimentares, data_cadastro, ativo)
OVERRIDING SYSTEM VALUE VALUES
(1, 2, 'Maria Aparecida Souza',  '12345678901', '1985-03-15', 'FEMININO',  '11911111111', 'maria.souza@email.com',  'Nenhuma',                            CURRENT_DATE, TRUE),
(2, 3, 'João Antonio Pereira',   '23456789012', '1978-07-22', 'MASCULINO', '11922222222', 'joao.pereira@email.com', 'Intolerância à lactose',             CURRENT_DATE, TRUE),
(3, 4, 'Lucia Helena Santos',    '34567890123', '1992-11-08', 'FEMININO',  '11933333333', 'lucia.santos@email.com', 'Nenhuma',                            CURRENT_DATE, TRUE),
(4, 5, 'Pedro Henrique Costa',   '45678901234', '2000-01-30', 'MASCULINO', '11944444444', 'pedro.costa@email.com',  'Dieta sem glúten',                   CURRENT_DATE, TRUE),
(5, 1, 'Dona Rosa Maria Lima',   '56789012345', '1950-06-10', 'FEMININO',  '11955555555', 'rosa.lima@email.com',    'Hipertensa - dieta com pouco sódio', CURRENT_DATE, TRUE);

-- ALIMENTOS
INSERT INTO alimentos (id_alimento, id_categoria, nome, descricao, unidade_medida, data_vencimento, ativo)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'Arroz Branco',    'Arroz tipo 1, pacote 5kg',      'kg',  '2026-12-31', TRUE),
(2, 1, 'Feijão Carioca',  'Feijão carioca tipo 1, 1kg',   'kg',  '2026-10-15', TRUE),
(3, 2, 'Banana Prata',    'Banana prata fresca',           'un',  '2026-06-01', TRUE),
(4, 2, 'Batata Doce',     'Batata doce fresca',            'kg',  '2026-06-10', TRUE);

-- ================================================================
-- NÍVEL 3: depende de users + enderecos + alimentos
-- ================================================================

-- PROFISSIONAIS
INSERT INTO profissionais (id_profissional, id_usuario, id_endereco, especialidade, registro_profissional, data_admissao)
OVERRIDING SYSTEM VALUE VALUES
(1, 2, 2, 'Clínico Geral', '12345-SP', '2023-01-15'),
(2, 3, 3, 'Cardiologista', '67890-SP', '2023-02-01'),
(3, 4, 4, 'Pediatra',      '11111-SP', '2024-03-10');

-- MÉDICOS
INSERT INTO medicos (id_medico, id_usuario, id_endereco, crm, especialidade_medica, data_admissao, ativo)
OVERRIDING SYSTEM VALUE VALUES
(1, 2, 2, '12345-SP', 'Clínico Geral', '2023-01-15', TRUE),
(2, 3, 3, '67890-SP', 'Cardiologista', '2023-02-01', TRUE),
(3, 4, 4, '11111-SP', 'Pediatra',      '2024-03-10', TRUE);

-- AGENDA (horários disponíveis no próximo mês)
INSERT INTO agenda (id_agenda, id_usuario, data, hora_inicio, hora_fim, disponivel)
OVERRIDING SYSTEM VALUE VALUES
(1, 2, CURRENT_DATE + INTERVAL '1 day',  '09:00', '10:00', TRUE),
(2, 2, CURRENT_DATE + INTERVAL '1 day',  '10:00', '11:00', TRUE),
(3, 3, CURRENT_DATE + INTERVAL '2 days', '14:00', '15:00', TRUE),
(4, 3, CURRENT_DATE + INTERVAL '2 days', '15:00', '16:00', TRUE),
(5, 4, CURRENT_DATE + INTERVAL '3 days', '08:00', '09:00', TRUE),
(6, 4, CURRENT_DATE + INTERVAL '3 days', '09:00', '10:00', TRUE);

-- ESTOQUE
INSERT INTO estoque (id_estoque, id_alimento, quantidade_atual, quantidade_minima, data_ultima_atualizacao)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 50.000, 10.000, NOW()),
(2, 2, 30.000,  5.000, NOW());

-- ================================================================
-- NÍVEL 4: depende de médicos, pacientes, agenda, etc.
-- ================================================================

-- PRONTUÁRIOS
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

-- CONSULTAS
INSERT INTO consultas (id_consulta, id_paciente, id_agenda, id_profissional, tipo_consulta, status, observacoes, data_agendamento, id_triagem)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 1, 'CONSULTA', 'CONCLUIDA',
 'Consulta de rotina. Exames solicitados.', '2025-11-20 08:00:00', 1),
(2, 2, 2, 1, 'CONSULTA', 'CONCLUIDA',
 'Paciente com queixas gástricas. Prescrito medicação.', '2025-12-05 08:00:00', 2),
(3, 3, 3, 2, 'URGENCIA', 'AGENDADA',
 'Paciente com palpitações. Aguardando exames.', '2026-01-10 10:00:00', 3),
(4, 5, 5, 2, 'RETORNO',  'AGENDADA',
 'Retorno para avaliação da pressão arterial.', '2026-03-01 08:00:00', NULL);

-- COMPRAS
INSERT INTO compras (id_compra, id_estoque, data_compra, observacoes)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, '2026-05-10 10:00:00', 'Compra mensal de arroz - 10 pacotes de 5kg'),
(2, 2, '2026-05-10 10:30:00', 'Compra mensal de feijão - 20 pacotes de 1kg');

-- DOAÇÕES
INSERT INTO doacoes (id_doacao, id_profissional, id_paciente, id_estoque, data_doacao, observacoes)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 1, '2026-05-15 14:00:00', 'Doação de 5kg de arroz para família Souza'),
(2, 2, 5, 2, '2026-05-16 09:00:00', 'Doação de 3kg de feijão para Dona Rosa');

-- NOTIFICAÇÕES
INSERT INTO notificacoes (id_notificacao, id_paciente, tipo, mensagem, data_envio, status_envio)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'LEMBRETE',  'Sua consulta está agendada para amanhã às 09:00.',                    '2025-11-19 18:00:00', 'ENVIADO'),
(2, 5, 'LEMBRETE',  'Não se esqueça do retorno cardiológico na próxima semana.',           '2026-02-25 10:00:00', 'ENVIADO'),
(3, 3, 'ALERTA',    'Resultado de exame disponível. Favor comparecer à unidade.',           '2026-01-15 14:30:00', 'PENDENTE');

-- ================================================================
-- NÍVEL 5: Filhas de prontuarios, compras, doacoes
-- ================================================================

-- ITENS DE PRONTUÁRIO
INSERT INTO itens_prontuario (id_item_prontuario, id_prontuario, tipo_item, descricao, data_registro, id_usuario)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 'EVOLUCAO',   'Primeira consulta: anamnese completa realizada.',                '2025-11-20 09:20:00', 2),
(2, 1, 'EXAME',      'Solicitado hemograma completo e glicemia em jejum.',             '2025-11-20 09:35:00', 2),
(3, 2, 'EVOLUCAO',   'Paciente orientado sobre dieta e medicação para gastrite.',      '2025-12-05 14:10:00', 2),
(4, 3, 'EXAME',      'Solicitado eletrocardiograma e ecocardiograma.',                 '2026-01-10 10:20:00', 3),
(5, 4, 'EVOLUCAO',   'Exame físico sem alterações. Paciente liberado.',                '2026-02-18 11:00:00', 4),
(6, 5, 'EVOLUCAO',   'Ajuste de medicação anti-hipertensiva. Retorno em 30 dias.',     '2026-03-01 08:45:00', 3);

-- EVOLUÇÕES CLÍNICAS
INSERT INTO evolucoes_clinicas (id_evolucao, id_prontuario, id_usuario, id_profissional, data_registro, setor, descricao)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 2, 1, '2025-11-25 10:00:00', 'CLINICA_MEDICA',
 'Retorno para resultado de exames. Hemograma normal. Glicemia: 98 mg/dL (normal). PA: 125x80. Mantém conduta.'),
(2, 1, 2, 1, '2025-12-10 09:30:00', 'CLINICA_MEDICA',
 'Paciente relata melhora da cefaleia após início de dieta com baixo sódio. PA controlada: 120x80.'),
(3, 2, 2, 1, '2025-12-20 14:00:00', 'AMBULATORIO',
 'Endoscopia realizada: gastrite enantematosa leve. Prescrito omeprazol 20mg por 30 dias.'),
(4, 3, 3, 2, '2026-01-20 11:00:00', 'CARDIOLOGIA',
 'ECG mostra taquicardia sinusal. Ecocardiograma com fração de ejeção preservada. Iniciado betabloqueador.'),
(5, 5, 3, 2, '2026-03-15 08:30:00', 'CARDIOLOGIA',
 'PA: 130x85. Relata tontura com a nova medicação. Ajustada dosagem. Retorno em 15 dias.');

-- RECEITAS MÉDICAS
INSERT INTO receitas_medicas (id_receita, id_prontuario, id_medico, data_emissao, descricao, data_validade)
OVERRIDING SYSTEM VALUE VALUES
(1, 2, 1, '2025-12-05 14:30:00',
 'Omeprazol 20mg - 1 cápsula em jejum por 30 dias.\nDomperidona 10mg - 1 comprimido 3x/dia por 15 dias.',
 '2026-06-05'),
(2, 3, 2, '2026-01-20 11:30:00',
 'Propranolol 40mg - 1 comprimido 2x/dia.\nAAS 100mg - 1 comprimido 1x/dia após almoço.',
 '2026-07-20'),
(3, 5, 2, '2026-03-01 09:00:00',
 'Losartana 50mg - 1 comprimido 1x/dia.\nHidroclorotiazida 25mg - 1 comprimido 1x/dia pela manhã.',
 '2026-09-01'),
(4, 1, 1, '2025-11-20 09:40:00',
 'Dipirona 500mg - 1 comprimido a cada 6h se dor (máx 3 dias).',
 '2026-05-20');

-- EXAMES
INSERT INTO exames (id_exame, id_prontuario, id_medico, id_tipo_exame, justificativa_clinica, data_solicitacao, status, observacoes_medico, data_realizacao)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 1, 'Avaliação inicial com cefaleia e tontura. Descartar anemia.',               '2025-11-20 09:30:00', 'REALIZADO', 'Hb 13.2 - normal. Leucócitos normais.', '2025-11-22'),
(2, 1, 1, 5, 'Rastreio de diabetes devido histórico familiar.',                            '2025-11-20 09:30:00', 'REALIZADO', 'Glicemia: 98 mg/dL - normal.',           '2025-11-22'),
(3, 3, 2, 4, 'Palpitações e taquicardia. Avaliar ritmo cardíaco.',                         '2026-01-10 10:25:00', 'REALIZADO', 'Taquicardia sinusal - 105 bpm.',         '2026-01-12'),
(4, 3, 2, 3, 'Dispneia aos esforços. Avaliar função cardíaca estrutural.',                 '2026-01-10 10:25:00', 'AGENDADO',  NULL,                                         NULL),
(5, 5, 2, 4, 'Acompanhamento de hipertensão. Controle periódico.',                         '2026-03-01 08:50:00', 'SOLICITADO', NULL,                                       NULL);

-- ITENS DE COMPRA
INSERT INTO itens_compra (id_item_compra, id_compra, id_alimento, quantidade, preco)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 50.000, 150.00),
(2, 2, 2, 20.000,  80.00),
(3, 2, 1, 10.000,  30.00);

-- ITENS DE DOAÇÃO
INSERT INTO itens_doacao (id_item_doacao, id_doacao, id_alimento, quantidade, peso)
OVERRIDING SYSTEM VALUE VALUES
(1, 1, 1, 5.000, 5.000),
(2, 2, 2, 3.000, 3.000),
(3, 1, 3, 12.000, NULL);

-- PROFISSIONAIS x COMPRAS
INSERT INTO profissionais_compras (id_profissional, id_compra)
VALUES
(1, 1),
(2, 2);

-- ================================================================
-- FIM
-- ================================================================

COMMIT;
