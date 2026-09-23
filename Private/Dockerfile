FROM node:20-alpine

WORKDIR /app

# Copy dependency specifications from whatsapp-bot
COPY whatsapp-bot/package*.json ./
RUN npm install --omit=dev

# Copy bot application and modules
COPY whatsapp-bot/ ./
COPY apis/ ./apis/

# Ensure auth storage directory exists
RUN mkdir -p auth_info_baileys

ENV NODE_ENV=production

CMD ["npm", "start"]
