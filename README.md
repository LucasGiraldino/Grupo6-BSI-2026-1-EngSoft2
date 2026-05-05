# Grupo6-BSI-2026-1-EngSoft2

## Design

- [Figma - SIGAAC System Layout Design](https://www.figma.com/make/gnVH3w0Peb7blLgHsfCPLr/SIGAAC-System-Layout-Design?fullscreen=1&t=RX0CCf6873XpA7lC-1)
O SIGAAC (Sistema Integrado de Gestão e Apoio à Associação do Câncer) é um sistema que tem por objetivo informatizar setores da Organização e promover melhorias, possibilita cadastros básicos de pacientes, profissionais e alimentos.

## Pré-requisitos

- Java 21
- Maven 3.9+
- Docker e Docker Compose

## Configuração do Banco de Dados

O projeto utiliza PostgreSQL via Docker Compose para facilitar o desenvolvimento em equipe.

### Passos para configurar:

1. **Copie o arquivo de ambiente:**
   ```bash
   cp sigaac/.env.example sigaac/.env
   ```

2. **Inicie o banco de dados:**
   ```bash
   cd sigaac
   docker-compose up -d
   ```

3. **Verifique se o banco está rodando:**
   ```bash
   docker-compose ps
   ```

### Configurações padrão:
- **Banco:** sigaac
- **Usuário:** postgres
- **Senha:** postgres
- **Porta:** 5432

Para alterar essas configurações, edite o arquivo `sigaac/.env`.

## Executando a Aplicação

```bash
cd sigaac
./mvnw spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080/api`

## Parando o Banco de Dados

```bash
cd sigaac
docker-compose down
```

Para remover também os dados persistidos:
```bash
docker-compose down -v
``` 
