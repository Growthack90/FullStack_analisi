# Usiamo Alpine: solo ~5MB di base invece di 300MB+
FROM node:20-alpine

WORKDIR /app

# Copiamo solo i file dei pacchetti per sfruttare la cache di Docker
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]