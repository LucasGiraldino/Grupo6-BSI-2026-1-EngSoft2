# Grupo6-BSI-2026-1-EngSoft2

## Design

- [Figma - SIGAAC System Layout Design](https://www.figma.com/make/gnVH3w0Peb7blLgHsfCPLr/SIGAAC-System-Layout-Design?fullscreen=1&t=RX0CCf6873XpA7lC-1)
O SIGAAC (Sistema Integrado de Gestão e Apoio à Associação do Câncer) é um sistema que tem por objetivo informatizar setores da Organização e promover melhorias, possibilita cadastros básicos de pacientes, profissionais e alimentos.

## Pré-requisitos

- Java 21
- Node.js 18+ e npm
- Maven 3.9+
- Docker e Docker Compose

## Estrutura do Projeto

```
Grupo6-BSI-2026-1-EngSoft2/
├── backend/          # Spring Boot (Java 21)
├── frontend/         # React + TypeScript + Vite
└── README.md
```

## Configuração do Banco de Dados

O projeto utiliza PostgreSQL via Docker Compose para facilitar o desenvolvimento em equipe.

### Passos para configurar:

1. **Copie o arquivo de ambiente:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Inicie o banco de dados:**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Verifique se o banco está rodando:**
   ```bash
   cd backend
   docker-compose ps
   ```

### Configurações padrão:
- **Banco:** sigaac
- **Usuário:** postgres
- **Senha:** postgres
- **Porta:** 5432

Para alterar essas configurações, edite o arquivo `backend/.env`.

## Executando a Aplicação

### 1. Backend (Spring Boot)

```bash
cd backend
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./mvnw spring-boot:run
```

O backend estará disponível em: `http://localhost:8080/api`

### 2. Frontend (React)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

> **Nota:** O frontend está configurado com proxy para redirecionar requisições `/api` para o backend automaticamente.

## Build para Produção

### Backend
```bash
cd backend
./mvnw package
java -jar target/sigaac-*.jar
```

### Frontend
```bash
cd frontend
npm run build
# Os arquivos gerados ficam na pasta dist/
```

## Parando o Banco de Dados

```bash
cd backend
docker-compose down
```

Para remover também os dados persistidos:
```bash
docker-compose down -v
```

## Usuários de Teste

Após iniciar a aplicação, os seguintes usuários são criados automaticamente:

- **Administrador:**
  - Email: `admin@sigaac.com`
  - Senha: `admin123`

- **Usuário Comum:**
  - Email: `user@sigaac.com`
  - Senha: `user123` 
