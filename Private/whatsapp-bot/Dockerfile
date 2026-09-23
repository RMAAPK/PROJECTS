FROM node:20-alpine

WORKDIR /app

# Install build essentials if required by native crypto
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Ensure auth storage exists
RUN mkdir -p auth_info_baileys

ENV NODE_ENV=production

CMD ["npm", "start"]
