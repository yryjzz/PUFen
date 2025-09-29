FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
RUN npm run build        # ← 就是这行漏了
COPY . .

EXPOSE 3001
CMD ["npm", "run", "start:prod"]