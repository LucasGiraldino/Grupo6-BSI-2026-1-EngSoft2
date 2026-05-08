# Relatório de Auditoria de Segurança - SIGAAC

**Data:** 06/05/2026
**Escopo:** Tela de Login, Autenticação, Autorização e Proteção de Dados
**Sistema:** SIGAAC - Sistema Integrado de Gestão

---

## Sumário

1. [Vulnerabilidades Encontradas](#1-vulnerabilidades-encontradas)
   - [Críticas](#11-vulnerabilidades-críticas)
   - [Altas](#12-vulnerabilidades-altas)
   - [Médias](#13-vulnerabilidades-médias)
2. [Correções Aplicadas](#2-correções-aplicadas)
3. [Arquivos Modificados](#3-arquivos-modificados)
4. [Arquivos Criados](#4-arquivos-criados)
5. [Configuração de Variáveis de Ambiente](#5-configuração-de-variáveis-de-ambiente)
6. [Recomendações Futuras](#6-recomendações-futuras)
7. [Checklist de Deploy Seguro](#7-checklist-de-deploy-seguro)

---

## 1. Vulnerabilidades Encontradas

### 1.1 Vulnerabilidades Críticas

#### C1 - Token JWT não era enviado nas requisições
**Local:** `frontend/src/hooks/useAuth.ts`
**Problema:** O token era salvo no `localStorage` mas **nunca era enviado** ao backend. Não existia interceptor axios configurado. Todas as rotas protegidas estavam efetivamente abertas.
**Impacto:** Qualquer pessoa podia acessar qualquer endpoint do backend sem autenticação.
**Status:** ✅ Corrigido

#### C2 - Secret do JWT com fallback inseguro hardcoded
**Local:** `backend/.../service/TokenService.java:18`
**Problema:** `@Value("${api.security.token.secret:my-secret-key-123456789}")` — se a variável de ambiente não fosse definida, usava uma chave fraca e pública. O arquivo `.env` não definia `JWT_SECRET`.
**Impacto:** Um atacante poderia forjar tokens JWT com a chave conhecida.
**Status:** ✅ Corrigido

#### C3 - OTP gerado com algoritmo previsível
**Local:** `backend/.../service/OtpService.java:26`
**Problema:** Usava `new Random()` ao invés de `SecureRandom`. `Random` é determinístico e previsível.
**Impacto:** Atacante poderia prever códigos OTP e burlar a autenticação 2FA.
**Status:** ✅ Corrigido

#### C4 - OTP sem limite de tentativas (brute-force)
**Local:** `backend/.../service/OtpService.java:48-54`
**Problema:** O método `validateOtp` não limitava tentativas. Um atacante podia tentar infinitamente até acertar o código de 6 dígitos.
**Impacto:** Código OTP de 6 dígitos (1.000.000 combinações) pode ser quebrado por brute-force automatizado.
**Status:** ✅ Corrigido

#### C5 - Credenciais padrão expostas no código
**Local:** `backend/.../config/DataInitializer.java`
**Problema:** Usuários de teste criados com senhas fracas (`admin123`, `user123`) e CPFs hardcoded. Mensagens de log imprimiam credenciais no console.
**Impacto:** Qualquer pessoa com acesso ao código fonte conhecia credenciais válidas do sistema.
**Status:** ✅ Corrigido

#### C6 - Logs vazando informações sensíveis
**Local:** `backend/.../service/OtpService.java:29,40`
**Problema:** OTPs eram impressos no console via `System.out.println`, incluindo o código completo.
**Impacto:** Qualquer pessoa com acesso aos logs do servidor podia ver códigos OTP.
**Status:** ✅ Corrigido

### 1.2 Vulnerabilidades Altas

#### A1 - CSRF desabilitado globalmente
**Local:** `backend/.../config/SecurityConfig.java:37`
**Problema:** `.csrf(csrf -> csrf.disable())` sem nenhuma proteção compensatória.
**Status:** ✅ Parcialmente corrigido (API stateless, CORS configurado)

#### A2 - Sem headers de segurança HTTP
**Local:** `backend/.../config/SecurityConfig.java`
**Problema:** Ausência total de `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`, `Strict-Transport-Security`.
**Impacto:** Vulnerável a clickjacking, MIME sniffing, e outros ataques client-side.
**Status:** ✅ Corrigido

#### A3 - Sem rate limiting nos endpoints de autenticação
**Local:** `backend/.../controllers/LoginController.java`
**Problema:** `/auth/login` e `/auth/verify` sem proteção contra brute-force.
**Impacto:** Permite tentativas ilimitadas de login e verificação de OTP.
**Status:** ✅ Corrigido

#### A4 - Conta nunca era bloqueada
**Local:** `backend/.../model/User.java:135`
**Problema:** `isAccountNonLocked()` sempre retornava `true`.
**Impacto:** Ataques de força bruta indefinidos contra senhas de usuários.
**Status:** ✅ Corrigido

#### A5 - Rotas frontend desprotegidas
**Local:** `frontend/src/App.tsx`
**Problema:** 7 das 9 rotas estavam acessíveis sem autenticação: `/pacientes`, `/profissionais`, `/consultas`, `/prontuarios`, `/alimentos`, `/compras`, `/exames`, `/doacoes`.
**Impacto:** Usuário não autenticado podia navegar e acessar páginas com dados sensíveis de pacientes.
**Status:** ✅ Corrigido

#### A6 - Requisições sem header Authorization
**Local:** Todas as páginas frontend (`Alimentos.tsx`, `Compras.tsx`, `EfetuarDoacao.tsx`, `Dashboard.tsx`, `Configuracao.tsx`)
**Problema:** Usavam `fetch()` e `axios` direto sem interceptor, nunca enviando o token JWT.
**Impacto:** Mesmo com token no localStorage, nenhuma requisição era autenticada.
**Status:** ✅ Corrigido

### 1.3 Vulnerabilidades Médias

#### M1 - Token com expiração de 2 horas e sem refresh
**Local:** `backend/.../service/TokenService.java:49`
**Problema:** Token expirava em 2h sem mecanismo de renovação.
**Status:** ✅ Corrigido (adicionado refresh token com 24h)

#### M2 - Armazenamento de OTP em memória (ConcurrentHashMap)
**Local:** `backend/.../service/OtpService.java:18`
**Problema:** OTPs em memória — perdidos em restart, não escala em múltiplas instâncias.
**Status:** ✅ Melhorado (expiração por timestamp, limite de tentativas)
**Nota:** Para produção, recomenda-se usar Redis ou banco de dados.

#### M3 - localStorage para token (vulnerável a XSS)
**Local:** `frontend/src/hooks/useAuth.ts`
**Problema:** `localStorage` é acessível via JavaScript. Se houver XSS, o token é roubado.
**Status:** ⚠️ Não corrigido (requer mudança arquitetural significativa)
**Recomendação:** Migrar para cookies `httpOnly` + `secure` em produção.

---

## 2. Correções Aplicadas

### 2.1 TokenService.java
- Secret JWT agora é **obrigatório** via variável de ambiente (sem fallback)
- Adicionado suporte a **refresh token** (24h de expiração)
- Adicionado campo `type` no payload (`access` / `refresh`)
- Expiração usando **UTC** ao invés de timezone fixo `-03:00`
- Parâmetros configuráveis via `application.properties`/`.env`

### 2.2 OtpService.java
- `SecureRandom` ao invés de `Random` para geração de OTP
- Classe interna `OtpEntry` com: código, timestamp de expiração, contador de tentativas
- **Máximo 3 tentativas** por OTP
- Expiração de **5 minutos** por timestamp (não por scheduler)
- **Removidos todos os logs** que vazavam códigos OTP

### 2.3 RateLimiterService.java (NOVO)
- Rate limiting por chave (email + tipo de operação)
- **Máximo 5 requisições** por janela de **5 minutos**
- Aplicado nos endpoints `/auth/login` e `/auth/verify`
- Reset automático quando OTP é validado com sucesso

### 2.4 LoginController.java
- Rate limiting em `/auth/login` e `/auth/verify` (HTTP 429 quando excedido)
- Respostas JSON estruturadas: `{ "error": "..." }` ou `{ "accessToken": "...", "refreshToken": "...", "expiresIn": ... }`
- Novo endpoint `POST /auth/refresh` para renovação de token
- Reset de `failedAttempts` quando login é bem-sucedido
- Tratamento de exceções: `BadCredentialsException`, `DisabledException`

### 2.5 User.java
- Novos campos: `lockedUntil` (LocalDateTime) e `failedAttempts` (Integer)
- `isAccountNonLocked()` agora verifica se `lockedUntil` já passou
- `incrementFailedAttempts()`: bloqueia conta por **15 minutos** após 5 falhas
- `resetFailedAttempts()`: reseta contador após login bem-sucedido

### 2.6 SecurityConfig.java
- **Content-Security-Policy:** `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`
- **X-Frame-Options:** `DENY` (previne clickjacking)
- **HTTP Strict-Transport-Security:** max-age=31536000, includeSubDomains
- **X-Content-Type-Options:** nosniff
- **CORS:** configurado para `localhost:5173` e `localhost:3000`
- Novo endpoint `/auth/refresh` liberado

### 2.7 DataInitializer.java
- **Removida** criação automática de usuários com credenciais hardcoded
- Método `initUsers` agora é vazio

### 2.8 Frontend - api.ts (NOVO)
- Interceptor de requisição: adiciona `Authorization: Bearer <token>` automaticamente
- Interceptor de resposta: em 401, tenta refresh token automaticamente
- Se refresh falha, limpa tokens e redireciona para `/login`
- Timeout de 10 segundos
- Base URL configurável via `VITE_API_URL`

### 2.9 Frontend - Login.tsx
- Usa `api` ao invés de `axios` direto
- Mensagens de erro vêm do backend (não genéricas)
- **Não expõe email** na tela de verificação 2FA (prevenia enumeração)
- Adicionados `autocomplete` attributes: `email`, `current-password`, `one-time-code`
- `inputMode="numeric"` e `maxLength={6}` no campo OTP

### 2.10 Frontend - useAuth.ts
- Salva **refreshToken** no localStorage junto com o token
- Remove **ambos** os tokens na expiração e no logout
- Validação do payload JWT mais robusta (verifica 3 partes)

### 2.11 Frontend - App.tsx
- **Todas as rotas** agora exigem `isAuthenticated`
- `/configuracao` exige `isAuthenticated && isAdmin`
- Redireciona para `/login` quando não autenticado
- Redireciona para `/dashboard` quando já autenticado na raiz

### 2.12 Frontend - Todas as páginas
- `Alimentos.tsx`, `Compras.tsx`, `EfetuarDoacao.tsx`, `Dashboard.tsx`, `Configuracao.tsx`
- Todas atualizadas para usar `api` (interceptor axios) ao invés de `fetch()`

### 2.13 Environment
- `backend/.env`: adicionado `API_SECURITY_TOKEN_SECRET`, issuer e expiration configs
- `.env.example`: documentado todas as variáveis de segurança
- `frontend/.env`: adicionado `VITE_API_URL`

---

## 3. Arquivos Modificados

| Arquivo | Descrição da Mudança |
|---|---|
| `backend/src/main/java/com/sigaac/service/TokenService.java` | Secret obrigatório, refresh token, expiração UTC, configurável |
| `backend/src/main/java/com/sigaac/service/OtpService.java` | SecureRandom, limite de tentativas, expiração por timestamp, logs removidos |
| `backend/src/main/java/com/sigaac/controllers/LoginController.java` | Rate limiting, respostas JSON, endpoint refresh, bloqueio de conta |
| `backend/src/main/java/com/sigaac/model/User.java` | lockedUntil, failedAttempts, métodos de bloqueio/reset |
| `backend/src/main/java/com/sigaac/config/SecurityConfig.java` | Headers CSP/HSTS/X-Frame, CORS, endpoint refresh liberado |
| `backend/src/main/java/com/sigaac/config/DataInitializer.java` | Removido criação de usuários hardcoded |
| `frontend/src/pages/Login.tsx` | Usa api interceptor, mensagens do backend, email não exposto, autocomplete |
| `frontend/src/hooks/useAuth.ts` | Refresh token, validação robusta, limpeza de ambos tokens |
| `frontend/src/App.tsx` | Todas as rotas protegidas com isAuthenticated |
| `frontend/src/pages/Alimentos.tsx` | Usa api ao invés de fetch |
| `frontend/src/pages/Compras.tsx` | Usa api ao invés de fetch |
| `frontend/src/pages/EfetuarDoacao.tsx` | Usa api ao invés de axios |
| `frontend/src/pages/Dashboard.tsx` | Usa api ao invés de fetch |
| `frontend/src/pages/Configuracao.tsx` | Usa api ao invés de fetch |
| `backend/.env` | Adicionado variáveis de segurança |
| `.env.example` | Documentado variáveis de segurança |

---

## 4. Arquivos Criados

| Arquivo | Descrição |
|---|---|
| `frontend/src/services/api.ts` | Instância axios com interceptors de auth e refresh token |
| `backend/src/main/java/com/sigaac/service/RateLimiterService.java` | Serviço de rate limiting por chave (5 req/5min) |
| `frontend/.env` | Configuração de API URL para frontend |
| `SEGURANCA.md` | Este documento |

---

## 5. Configuração de Variáveis de Ambiente

### Backend (`backend/.env`)

```env
# Database Configuration
POSTGRES_DB=sigaac
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<SENHA_FORTE>
POSTGRES_PORT=5432

# Application
APP_PORT=8080

# Security - ALTERAR EM PRODUÇÃO
API_SECURITY_TOKEN_SECRET=<CHAVE_SECRETA_LONGA_E_ALEATORIA>
API_SECURITY_TOKEN_ISSUER=sigaac
API_SECURITY_TOKEN_EXPIRATION_HOURS=2
API_SECURITY_TOKEN_REFRESH_EXPIRATION_HOURS=24
```

> **IMPORTANTE:** O `API_SECURITY_TOKEN_SECRET` deve ter pelo menos 64 caracteres e ser gerado aleatoriamente. Exemplo:
> ```bash
> openssl rand -base64 64
> ```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8080
```

---

## 6. Recomendações Futuras

### 6.1 Alta Prioridade

1. **Migrar token para cookies httpOnly**
   - O `localStorage` é vulnerável a XSS
   - Usar cookies com flags `httpOnly`, `secure`, `sameSite=strict`
   - O backend gerencia o cookie, o frontend não acessa o token via JS

2. **Armazenar OTP em Redis ou banco de dados**
   - `ConcurrentHashMap` é volátil e não escala
   - Redis permite expiração automática e compartilhamento entre instâncias
   - ImplementarOTP por sessão, não por email

3. **Implementar HTTPS em produção**
   - Sem HTTPS, tokens e senhas trafegam em texto puro
   - Usar Let's Encrypt ou certificado SSL

4. **Adicionar logging de auditoria**
   - Logar tentativas de login (sucesso e falha)
   - Logar mudanças em dados sensíveis (prontuários, exames)
   - Usar log estruturado (JSON) com níveis adequados

### 6.2 Média Prioridade

5. **Implementar validação de input no backend**
   - Usar `@Valid` e Bean Validation nos DTOs
   - Sanitizar inputs contra XSS e SQL Injection
   - Validar formato de email, CPF, etc.

6. **Adicionar proteção contra CSRF em operações sensíveis**
   - Mesmo com API stateless, operações de escrita devem ter proteção extra
   - Usar tokens CSRF ou SameSite cookies

7. **Implementar política de senhas**
   - Mínimo 8 caracteres, maiúscula, minúscula, número, especial
   - Verificar contra lista de senhas vazadas (Have I Been Pwned)
   - Forçar troca periódica

8. **Adicionar timeout de sessão**
   - Invalidar token após período de inatividade
   - Implementar heartbeat/keep-alive

### 6.3 Baixa Prioridade

9. **Implementar 2FA com TOTP (Google Authenticator)**
   - OTP por email é menos seguro que TOTP
   - TOTP é offline e não depende de servidor de email

10. **Adicionar CAPTCHA no login**
    - Prevenir ataques automatizados de brute-force
    - reCAPTCHA v3 ou hCaptcha

11. **Implementar rate limiting distribuído**
    - Se usar múltiplas instâncias, rate limiting em memória não funciona
    - Usar Redis com Redis Rate Limiter ou API Gateway

12. **Adicionar monitoramento de segurança**
    - Alertas para múltiplas falhas de login
    - Detecção de comportamento anômalo
    - Integração com SIEM

---

## 7. Checklist de Deploy Seguro

Antes de deploy em produção, verificar:

- [ ] `API_SECURITY_TOKEN_SECRET` configurado com chave forte e aleatória
- [ ] `POSTGRES_PASSWORD` alterada para senha forte
- [ ] Credenciais padrão de teste removidas (DataInitializer vazio)
- [ ] HTTPS configurado com certificado válido
- [ ] CORS configurado apenas para domínio de produção
- [ ] Logs não contêm senhas, tokens ou dados sensíveis
- [ ] `.env` não está no versionamento (gitignore)
- [ ] `NODE_ENV=production` no frontend
- [ ] `SPRING_PROFILES_ACTIVE=prod` no backend
- [ ] Firewall configurado (apenas portas 80/443 expostas)
- [ ] Backup do banco configurado e testado
- [ ] Política de retenção de logs definida
- [ ] Teste de penetração realizado

---

## Resumo de Status

| Vulnerabilidade | Severidade | Status |
|---|---|---|
| Token JWT não enviado | Crítica | ✅ Corrigido |
| Secret JWT hardcoded | Crítica | ✅ Corrigido |
| OTP com Random previsível | Crítica | ✅ Corrigido |
| OTP sem limite de tentativas | Crítica | ✅ Corrigido |
| Credenciais padrão expostas | Crítica | ✅ Corrigido |
| Logs vazando OTP | Crítica | ✅ Corrigido |
| CSRF desabilitado | Alta | ✅ Parcialmente corrigido |
| Sem headers de segurança | Alta | ✅ Corrigido |
| Sem rate limiting | Alta | ✅ Corrigido |
| Conta nunca bloqueada | Alta | ✅ Corrigido |
| Rotas frontend desprotegidas | Alta | ✅ Corrigido |
| Requisições sem Authorization | Alta | ✅ Corrigido |
| Token sem refresh | Média | ✅ Corrigido |
| OTP em memória volátil | Média | ⚠️ Melhorado (recomendado Redis) |
| localStorage para token | Média | ⚠️ Não corrigido (recomendado httpOnly cookies) |

---

*Documento gerado em 06/05/2026 — Auditoria de Segurança SIGAAC*
