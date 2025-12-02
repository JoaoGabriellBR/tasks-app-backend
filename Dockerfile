# Build multiestágio para produção
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de pacote
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de pacote
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar Prisma Client do estágio de build
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

# Copiar aplicação compilada
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Executar migrações e iniciar o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
