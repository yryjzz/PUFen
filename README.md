# PUFen - 积分签到系统

> 一个基于 React + TypeScript + Fastify 构建的现代化积分签到系统，以可爱的小猪存钱罐为主题，支持每日签到、团队组队、积分兑换等功能。

### 点击访问👉

- https://pu-fen-amber.vercel.app

## 🌟 项目特色

- 🐷 **可爱主题**：以小猪存钱罐为设计主题，界面温馨有趣
- 📱 **移动端优先**：专为移动端优化，支持触摸反馈、振动、分享等原生功能
- 🎯 **游戏化设计**：签到日历、连续签到奖励、团队组队等游戏化元素
- ⚡ **现代技术栈**：React 18 + TypeScript + Fastify + SQLite
- 🔄 **实时交互**：下拉刷新、实时状态更新、流畅动画
- 🎁 **多重奖励**：每日签到、连续奖励、团队瓜分、积分兑换

## 📋 目录

- [项目特色](#-项目特色)
- [技术架构](#-技术架构)
- [功能特性](#-功能特性)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [API 文档](#-api-文档)
- [数据库设计](#-数据库设计)
- [部署指南](#-部署指南)
- [开发规范](#-开发规范)
- [故障排查](#-故障排查)
- [版本历史](#-版本历史)
- [贡献指南](#-贡献指南)

## 🏗️ 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Ant Design + Styled Components
- **状态管理**: Zustand
- **路由**: React Router DOM
- **HTTP 客户端**: Axios
- **时间处理**: Day.js
- **移动端优化**: PWA、触摸反馈、振动API

### 后端技术栈
- **运行时**: Node.js + TypeScript
- **Web 框架**: Fastify
- **数据库**: SQLite + TypeORM
- **身份验证**: JWT + bcrypt
- **定时任务**: node-cron
- **开发工具**: tsx、nodemon

### 部署架构
- **前端**: Vercel (静态部署)
- **后端**: Render (容器化部署)
- **数据库**: SQLite (本地文件存储)
- **CDN**: 静态资源缓存

## ✨ 功能特性

### 🔐 用户系统
- [x] 手机号注册/登录
- [x] JWT 身份验证
- [x] 用户信息管理
- [x] 新用户标识与权益

### 📅 签到系统
- [x] 每日签到获取积分
- [x] 7天签到日历展示
- [x] 动态积分倍数（周一1倍，周二-周五随机1-1.5倍，周六0.6倍，周日2倍）
- [x] 连续签到奖励（随机3-5天获得优惠券）
- [x] 补签功能（5积分或下单补签）
- [x] 签到状态可视化

### 👥 团队系统
- [x] 创建团队（队长）
- [x] 邀请码加入团队
- [x] 100积分瓜分机制
- [x] 新用户奖励（新用户+10分，队长+10分）
- [x] 3小时团队时效
- [x] 实时团队状态

### 🎁 积分兑换
- [x] 两阶段商品解锁机制
- [x] 多种优惠券类型（满减券）
- [x] 库存管理
- [x] 兑换记录
- [x] 动态价格策略

### 📱 移动端体验
- [x] 响应式设计
- [x] 触摸反馈与振动
- [x] 下拉刷新
- [x] 原生分享功能
- [x] PWA 支持
- [x] 全屏沉浸式体验
- [x] iOS/Android 优化

### 📊 数据统计
- [x] 积分变动记录
- [x] 签到历史记录
- [x] 团队参与记录
- [x] 兑换历史记录
- [x] 用户行为分析

## 📁 项目结构

```
PUFen/
├── api/                          # 后端服务
│   ├── src/
│   │   ├── app.ts               # Fastify 应用配置
│   │   ├── server.ts            # 服务器启动文件
│   │   ├── config/
│   │   │   └── db.ts           # 数据库配置
│   │   ├── controllers/         # 控制器层
│   │   │   ├── auth.controller.ts
│   │   │   ├── points.controller.ts
│   │   │   ├── signin.controller.ts
│   │   │   ├── team.controller.ts
│   │   │   ├── reward.controller.ts
│   │   │   └── coupon.controller.ts
│   │   ├── entities/           # 数据实体
│   │   │   ├── User.ts
│   │   │   ├── PointsAccount.ts
│   │   │   ├── SignInRecord.ts
│   │   │   ├── Team.ts
│   │   │   ├── RewardItem.ts
│   │   │   └── UserCoupon.ts
│   │   ├── services/           # 业务逻辑层
│   │   ├── tasks/              # 定时任务
│   │   ├── middleware/         # 中间件
│   │   ├── scripts/            # 脚本工具
│   │   └── utils/              # 工具函数
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── web/                         # 前端应用
│   ├── src/
│   │   ├── components/         # 通用组件
│   │   │   ├── mobile.tsx      # 移动端组件
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/              # 页面组件
│   │   │   ├── Login.tsx       # 登录页
│   │   │   ├── Register.tsx    # 注册页
│   │   │   ├── Points.tsx      # 积分主页
│   │   │   ├── InviteFriend.tsx # 团队邀请
│   │   │   ├── Records.tsx     # 记录页面
│   │   │   ├── Coupons.tsx     # 优惠券页面
│   │   │   ├── Rules.tsx       # 规则说明
│   │   │   ├── Profile.tsx     # 个人中心
│   │   │   └── MobileDemo.tsx  # 移动端演示
│   │   ├── services/           # API 服务
│   │   ├── store/              # 状态管理
│   │   ├── styles/             # 样式文件
│   │   ├── types/              # 类型定义
│   │   └── utils/              # 工具函数
│   ├── public/                 # 静态资源
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── docs/                       # 文档
│   └── 概要设计.md
└── README.md                   # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0
- npm >= 8.0 或 yarn >= 1.22
- Git

### 1. 克隆项目
```bash
git clone https://github.com/yryjzz/PUFen.git
cd PUFen
```

### 2. 启动后端服务
```bash
cd api
npm install
npm run dev
```
后端服务将在 `http://localhost:3001` 启动

### 3. 启动前端应用
```bash
cd web
npm install
npm run dev
```
前端应用将在 `http://localhost:3000` 启动

### 4. 访问应用
打开浏览器访问 `http://localhost:3000`，建议使用移动端模式体验最佳效果。

## 📡 API 文档

### 认证相关
```http
POST /api/auth/register    # 用户注册
POST /api/auth/login       # 用户登录
GET  /api/auth/profile     # 获取用户信息
```

### 积分系统
```http
GET  /api/points/account         # 获取积分账户
GET  /api/points/weekly-config   # 获取本周签到配置
GET  /api/points/signin-status   # 获取签到状态
POST /api/points/signin          # 执行签到
GET  /api/points/records         # 获取积分记录
```

### 团队系统
```http
POST /api/team/create      # 创建团队
POST /api/team/join        # 加入团队
GET  /api/team/my-team     # 获取我的团队
PUT  /api/team/refresh     # 刷新邀请码
GET  /api/team/records     # 获取团队记录
```

### 兑换系统
```http
GET  /api/reward/items     # 获取商品列表
POST /api/reward/exchange  # 兑换商品
GET  /api/reward/records   # 获取兑换记录
GET  /api/coupon/my        # 获取我的优惠券
```

## 🗄️ 数据库设计

### 核心实体

#### 用户表 (User)
```typescript
{
  id: string          // UUID主键
  username: string    // 用户昵称
  phone: string       // 手机号（唯一）
  password: string    // 加密密码
  isNewUser: boolean  // 新用户标识
  createdAt: Date     // 创建时间
  updatedAt: Date     // 更新时间
}
```

#### 积分账户表 (PointsAccount)
```typescript
{
  id: string          // UUID主键
  userId: string      // 用户ID
  balance: number     // 当前余额
  totalEarned: number // 累计获得
  totalUsed: number   // 累计使用
  createdAt: Date     // 创建时间
  updatedAt: Date     // 更新时间
}
```

#### 签到配置表 (SignInConfig)
```typescript
{
  id: string              // UUID主键
  weekStartDate: Date     // 本周开始日期
  basePoints: number      // 基础积分(10)
  day1Multiplier: number  // 周一倍数(1.0)
  day2Multiplier: number  // 周二倍数(1.0-1.5)
  day3Multiplier: number  // 周三倍数(1.0-1.5)
  day4Multiplier: number  // 周四倍数(1.0-1.5)
  day5Multiplier: number  // 周五倍数(1.0-1.5)
  day6Multiplier: number  // 周六倍数(0.6)
  day7Multiplier: number  // 周日倍数(2.0)
  bonusDay: number        // 奖励日(3-5随机)
  bonusCoupon: string     // 奖励优惠券类型
}
```

#### 团队表 (Team)
```typescript
{
  id: string          // UUID主键
  captainId: string   // 队长ID
  name: string        // 团队名称
  inviteCode: string  // 邀请码
  startTime: Date     // 开始时间
  endTime: Date       // 结束时间(+3小时)
  totalPoints: number // 总积分池(100)
  status: string      // 状态(active/completed/expired)
}
```

#### 奖励商品表 (RewardItem)
```typescript
{
  id: string              // UUID主键
  name: string            // 商品名称
  description: string     // 商品描述
  pointsCost: number      // 所需积分
  couponType: string      // 优惠券类型
  couponValue: number     // 优惠金额
  conditionAmount: number // 满减条件
  stock: number           // 库存
  stage: number           // 阶段(1/2)
  isLimited: boolean      // 是否限量
}
```

### 关系设计
- User ↔ PointsAccount (1:1)
- User ↔ SignInRecord (1:N)
- User ↔ TeamMember (1:N)
- Team ↔ TeamMember (1:N)
- User ↔ RewardRecord (1:N)
- User ↔ UserCoupon (1:N)

## 🚀 部署指南

### 前端部署 (Vercel)

1. **连接 GitHub 仓库**
```bash
# 推送代码到 GitHub
git push origin main
```

2. **Vercel 配置**
```json
{
  "buildCommand": "cd web && npm run build",
  "outputDirectory": "web/dist",
  "framework": "vite"
}
```

3. **环境变量**
```env
VITE_API_URL=https://your-api-domain.com
```

### 后端部署 (Render)

1. **Dockerfile 配置**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

2. **环境变量**
```env
NODE_ENV=production
JWT_SECRET=your-jwt-secret
PORT=3001
```

3. **数据持久化**
```bash
# Render 持久化目录
/var/data/pufen.db
```

### 域名与 HTTPS
- 前端：`https://pufen.vercel.app`
- 后端：`https://pufen-api.render.com`
- 配置 CORS 允许前端域名访问

## 📏 开发规范

### 代码风格
- **TypeScript**: 严格模式，完整类型注解
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **命名规范**: PascalCase(组件)、camelCase(函数/变量)、kebab-case(文件)

### Git 提交规范
```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建/工具链更新
```

### 开发工作流
1. 创建功能分支：`git checkout -b feature/新功能`
2. 开发并测试功能
3. 提交代码：`git commit -m "feat: 添加新功能"`
4. 推送分支：`git push origin feature/新功能`
5. 创建 Pull Request
6. 代码审查后合并

### 测试策略
- **单元测试**: Jest + Testing Library
- **集成测试**: API 接口测试
- **E2E 测试**: Cypress 端到端测试
- **性能测试**: Lighthouse 性能评估

## 🔧 故障排查

### 常见问题

#### 1. 安装依赖失败
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScript 类型错误
```bash
# 检查类型定义
npm run type-check

# 重新安装类型包
npm install @types/node @types/react --save-dev
```

#### 3. API 请求失败
```bash
# 检查后端服务状态
curl http://localhost:3001/api/health

# 检查代理配置 (vite.config.ts)
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

#### 4. 数据库连接问题
```bash
# 检查数据库文件权限
ls -la src/database/

# 重新初始化数据库
rm src/database/dev.db
npm run dev
```

#### 5. 移动端体验问题
- 确保使用 HTTPS (PWA 要求)
- 检查 viewport meta 标签
- 验证触摸事件绑定
- 测试不同设备兼容性