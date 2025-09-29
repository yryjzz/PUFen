FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm ci --omit=dev
RUN npm run build

COPY . .

EXPOSE 3001
CMD ["npm", "run", "start:prod"]