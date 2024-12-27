FROM node:22-slim

# Atualiza os pacotes e instala as dependências necessárias
RUN apt-get update && apt-get install -y \
  wget \
  curl \
  ca-certificates \
  fonts-liberation \
  chromium \
  git && \
  rm -rf /var/lib/apt/lists/*

# Define o usuário para 'node'
USER node

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos da aplicação para o diretório de trabalho
COPY --chown=node:node . .

# Instala as dependências do npm
RUN npm install

# Expõe a porta 3000
EXPOSE 3000

# Define o comando padrão para iniciar a aplicação
CMD ["npm", "start"]
