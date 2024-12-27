FROM node:22-slim

RUN apt-get update && apt-get install -y wget curl ca-certificates fonts-liberation chromium git && rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /app

COPY package.json ./
COPY index.js ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
