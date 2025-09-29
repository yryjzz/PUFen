# PU分 - 积分签到系统前端

基于 React + TypeScript + Vite 构建的现代化积分签到系统前端应用。

## 技术栈
- React 18 + TypeScript
- Vite
- Ant Design + Styled Components
- Zustand
- React Router DOM
- Axios
- Day.js

## 项目结构
```
web/
├── public/                 # 静态资源
├── src/
│   ├── components/        # 通用组件
│   │   ├── mobile.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── styled.tsx
│   ├── pages/             # 页面组件
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Points.tsx
│   │   ├── Records.tsx
│   │   ├── Rules.tsx
│   │   ├── Profile.tsx
│   │   └── MobileDemo.tsx
│   ├── services/          # API服务
│   ├── store/             # 状态管理
│   ├── styles/            # 样式文件
│   ├── types/             # 类型定义
│   └── utils/             # 工具函数
```

## 快速开始

### 环境要求
- Node.js >= 16
- npm >= 8 或 yarn >= 1.22

### 安装依赖
```bash
cd web
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```
访问 http://localhost:3000 查看应用

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## API 配置
前端默认配置了代理，将 `/api` 开头的请求转发到后端服务器。
在 `vite.config.ts` 中修改后端地址：
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001', // 修改为你的后端地址
      changeOrigin: true,
    },
  },
}
```

## 主要页面介绍
- 登录/注册页面：手机号+密码登录、注册、表单验证
- 积分主页：积分余额、签到日历、连续签到奖励、组队邀请、积分兑换
- 记录页面：积分记录、组队记录、兑换记录
- 规则页面：积分规则说明
- 个人中心：用户信息、积分统计

## 状态管理
使用 Zustand 进行状态管理，主要包含：
- 认证状态 (useAuthStore)：用户信息、登录状态、Token管理
- 积分状态 (usePointsStore)：积分账户、签到配置、签到状态

## 样式系统
- styled-components：主题色彩绿色系，移动端优先，动画效果
- Ant Design：表单、反馈、导航等基础UI组件

## 开发规范
- 文件命名：PascalCase（组件/页面），camelCase（工具）
- 代码风格：TypeScript严格模式，ESLint检查，函数式组件+Hooks
- Git提交规范：feat/fix/docs/style/refactor/test/chore

## 部署说明
- 环境变量：`.env.production` 配置API地址
- Nginx配置：静态资源+API代理

## 故障排查
- 依赖安装失败：清除缓存重新安装
- TypeScript类型错误：检查tsconfig和依赖类型
- API请求失败：检查代理和后端服务
- 构建失败：检查代码类型错误