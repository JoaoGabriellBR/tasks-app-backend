# Tasks App - Backend

API backend NestJS para gerenciamento de tarefas com Prisma ORM e banco de dados SQLite.

## Stack Tecnológico

- **Framework**: NestJS 10.x
- **ORM**: Prisma 5.x
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (pronto para produção)
- **Validação**: class-validator + class-transformer
- **Linguagem**: TypeScript 5.x

## Funcionalidades

✅ API RESTful com dois endpoints:
- `POST /tasks` - Criar uma nova tarefa
- `GET /tasks` - Listar todas as tarefas

✅ Validação automática de requisições usando DTOs  
✅ Prisma ORM para acesso type-safe ao banco de dados  
✅ CORS habilitado para comunicação com o frontend  
✅ Caminho fácil de migração para PostgreSQL

---

## Pré-requisitos

- Node.js 18+ e npm
- (Opcional) Docker para deployment containerizado

---

## Instalação e Configuração

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

O `.env` padrão usa SQLite para desenvolvimento local:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

**Para PostgreSQL** (produção), atualize para:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tasks_db?schema=public"
```

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Executar Migrations do Banco de Dados

```bash
npm run prisma:migrate
```

Isso cria o banco de dados SQLite (`dev.db`) com a tabela Task.

### 5. Iniciar Servidor de Desenvolvimento

```bash
npm run start:dev
```

O servidor iniciará em **http://localhost:3000**

---

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run start:dev` | Inicia servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm start` | Inicia servidor de produção |
| `npm run prisma:generate` | Gera Prisma Client |
| `npm run prisma:migrate` | Executa migrations do banco de dados |
| `npm run prisma:studio` | Abre Prisma Studio (editor visual de BD) |
| `npm test` | Executa testes Jest |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:cov` | Executa testes com cobertura |

---

## Documentação da API

### POST /tasks

Cria uma nova tarefa.

**Corpo da Requisição:**

```json
{
  "title": "Título da Minha Tarefa",
  "description": "Descrição opcional da tarefa",
  "status": "to-do"
}
```

**Regras de Validação:**
- `title` (obrigatório): 1-255 caracteres
- `description` (opcional): qualquer string
- `status` (obrigatório): deve ser um de: `"to-do"`, `"doing"`, `"done"`

**Resposta** (201 Created):

```json
{
  "id": 1,
  "title": "Título da Minha Tarefa",
  "description": "Descrição opcional da tarefa",
  "status": "TO_DO",
  "createdAt": "2025-11-29T23:00:00.000Z",
  "updatedAt": "2025-11-29T23:00:00.000Z"
}
```

**Resposta de Erro** (400 Bad Request):

```json
{
  "statusCode": 400,
  "message": ["title must be between 1 and 255 characters"],
  "error": "Bad Request"
}
```

### GET /tasks

Recupera todas as tarefas, ordenadas por data de criação (mais recentes primeiro).

**Resposta** (200 OK):

```json
[
  {
    "id": 2,
    "title": "Segunda Tarefa",
    "description": null,
    "status": "DOING",
    "createdAt": "2025-11-29T23:05:00.000Z",
    "updatedAt": "2025-11-29T23:05:00.000Z"
  },
  {
    "id": 1,
    "title": "Primeira Tarefa",
    "description": "Alguns detalhes",
    "status": "TO_DO",
    "createdAt": "2025-11-29T23:00:00.000Z",
    "updatedAt": "2025-11-29T23:00:00.000Z"
  }
]
```

---

## Testando com curl

### Criar uma tarefa:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Tarefa de Teste","description":"Testando a API","status":"to-do"}'
```

### Listar todas as tarefas:

```bash
curl http://localhost:3000/tasks
```

### Testar validação (deve falhar):

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"","status":"invalid"}'
```

---

## Deployment com Docker

### Construir a imagem:

```bash
docker build -t tasks-app-backend .
```

### Executar o container:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./dev.db" \
  tasks-app-backend
```

Para produção com PostgreSQL, passe a `DATABASE_URL` apropriada:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/tasks_db" \
  tasks-app-backend
```

---

## Estrutura do Projeto

```
backend/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados (modelo Task)
├── src/
│   ├── tasks/
│   │   ├── dto/
│   │   │   └── create-task.dto.ts  # DTO com decorators de validação
│   │   ├── tasks.controller.ts     # Endpoints REST
│   │   ├── tasks.service.ts        # Lógica de negócio + queries Prisma
│   │   └── tasks.module.ts         # Módulo NestJS
│   ├── app.module.ts          # Módulo raiz
│   └── main.ts                # Ponto de entrada (CORS, validação)
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env (criar a partir de .env.example)
```

---

## Mudando para PostgreSQL

1. Atualize o `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tasks_db?schema=public"
```

2. Atualize `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Mude de "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Re-execute as migrations:

```bash
npm run prisma:migrate
```

---

## Próximos Passos para Produção

- [ ] Adicionar autenticação (JWT, Passport)
- [ ] Implementar endpoints PATCH/DELETE
- [ ] Adicionar paginação para GET /tasks
- [ ] Adicionar parâmetros de filtro/ordenação
- [ ] Implementar tratamento de erros com Exception Filters
- [ ] Adicionar middleware de logging de requisições
- [ ] Configurar variáveis baseadas em ambiente
- [ ] Adicionar testes unitários e e2e abrangentes
- [ ] Configurar rate limiting
- [ ] Adicionar documentação Swagger/OpenAPI

---

## Solução de Problemas

**Problema**: `PrismaClient is not defined`  
**Solução**: Execute `npm run prisma:generate`

**Problema**: `Environment variable not found: DATABASE_URL`  
**Solução**: Crie o arquivo `.env` a partir de `.env.example`

**Problema**: Porta 3000 já está em uso  
**Solução**: Altere `PORT` no `.env` ou pare o processo conflitante

---

## Licença

MIT
