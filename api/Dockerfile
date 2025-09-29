FROM node:20-alpine
WORKDIR /app

# 复制 package 文件并安装依赖
COPY package*.json ./
RUN npm ci

# 复制源码和配置文件
COPY tsconfig.json ./
COPY src ./src

# 构建应用
RUN npm run build

# 复制其他必要文件（如果需要的话）
COPY . .

EXPOSE 3001
CMD ["npm", "run", "start:prod"]