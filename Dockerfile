FROM node:22-slim

RUN apt-get update && apt-get install -y \
  wget \
  curl \
  ca-certificates \
  fonts-liberation \
  chromium \
  git && \
  rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./
RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]
