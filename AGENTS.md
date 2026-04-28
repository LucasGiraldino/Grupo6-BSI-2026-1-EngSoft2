# AGENTS.md - Grupo6-BSI-2026-1-EngSoft2

## Repository Context

Academic software engineering project (university course assignment).

- **Project**: SIGAAC - Sistema Integrado de Gestão e Apoio à Associação do Câncer
- **Course**: Engenharia de Software I (2º Semestre/2025)
- **Team**: Lucas Filipe (262412284), Bryan dos Santos (262412500), Felipe Lima (262413540), Matheus Borges (262411768)
- **Professor**: Profº Me. Bruno Santos de Lima

## Tech Stack

- **Framework**: Spring Boot 3.4.1
- **Java**: 21
- **Build**: Maven 3.9.9
- **Database**: PostgreSQL

## Project Structure

```
sigaac/
├── pom.xml
├── mvnw / mvnw.cmd
├── src/
│   ├── main/
│   │   ├── java/com/sigaac/
│   │   │   ├── SigaacApplication.java (main class)
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   ├── dto/
│   │   │   └── exception/
│   │   └── resources/
│   │       └── application.properties
│   └── test/java/com/sigaac/
```

## Commands

```bash
./mvnw spring-boot:run    # Development
./mvnw package           # Build JAR
java -jar target/sigaac-*.jar
```

## Important Files

- `SIGAAC - Especificação de Requisitos do Software.md`: Full requirements specification (675 lines)
- `sigaac/pom.xml`: Maven dependencies (spring-boot-starter-web, data-jpa, data-rest, validation, postgresql, lombok)
- `sigaac/src/main/resources/application.properties`: Database and server config

## Notes

- Database `sigaac` must be created in PostgreSQL before running
- Default port: 8080
- REST API base path: `/api`