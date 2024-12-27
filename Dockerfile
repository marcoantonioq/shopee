FROM node:22-slim

RUN apt-get update && apt-get install -y wget curl ca-certificates fonts-liberation chromium git && rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /app

RUN git clone git@github.com:marcoantonioq/shopee.git . && npm install

RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["npm", "start"]
