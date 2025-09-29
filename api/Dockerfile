# 使用官方 Node 20 镜像
FROM node:20-alpine

# 创建并进入工作目录
WORKDIR /app

# 先复制包管理文件 → 利用缓存层
COPY package*.json ./

# 一次性安装依赖（无缓存挂载）
RUN npm ci --omit=dev

# 再复制源码
COPY . .

# 编译 TypeScript
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动生产脚本
CMD ["npm", "run", "start:prod"]