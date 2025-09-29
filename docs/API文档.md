# PUFen 积分签到系统 - API 接口文档

## 📋 目录

- [接口概述](#接口概述)
- [认证方式](#认证方式)
- [通用响应格式](#通用响应格式)
- [错误码说明](#错误码说明)
- [认证相关接口](#认证相关接口)
- [积分系统接口](#积分系统接口)
- [团队系统接口](#团队系统接口)
- [奖励系统接口](#奖励系统接口)
- [优惠券接口](#优惠券接口)
- [记录查询接口](#记录查询接口)
- [工具接口](#工具接口)

## 接口概述

### 基础信息
- **基础URL**: `https://pufen-api.render.com` (生产环境)
- **基础URL**: `http://localhost:3001` (开发环境)
- **协议**: HTTPS/HTTP
- **数据格式**: JSON
- **字符编码**: UTF-8

### 请求头
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  # 需要认证的接口
```

## 认证方式

本系统采用JWT (JSON Web Token) 进行身份验证。

### 获取Token
通过登录接口获取JWT Token，Token有效期为7天。

### 使用Token
在需要认证的接口请求头中添加：
```http
Authorization: Bearer <your_jwt_token>
```

### Token刷新
Token过期前可通过用户信息接口验证，过期后需重新登录。

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {}, // 具体数据
  "message": "操作成功"
}
```

### 失败响应
```json
{
  "success": false,
  "message": "错误描述",
  "error": "ERROR_CODE"
}
```

### 分页响应
```json
{
  "success": true,
  "data": {
    "items": [], // 数据列表
    "total": 100, // 总数量
    "page": 1, // 当前页
    "limit": 20, // 每页数量
    "totalPages": 5 // 总页数
  }
}
```

## 错误码说明

| 错误码 | HTTP状态码 | 说明 |
|--------|------------|------|
| AUTH_REQUIRED | 401 | 需要登录认证 |
| AUTH_INVALID | 401 | 认证失败或Token无效 |
| AUTH_EXPIRED | 401 | Token已过期 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| VALIDATION_ERROR | 400 | 参数验证失败 |
| DUPLICATE_ERROR | 409 | 数据重复冲突 |
| INSUFFICIENT_POINTS | 400 | 积分不足 |
| TEAM_FULL | 400 | 团队已满 |
| TEAM_EXPIRED | 400 | 团队已过期 |
| ALREADY_SIGNED | 400 | 今日已签到 |
| OUT_OF_STOCK | 400 | 商品库存不足 |
| SERVER_ERROR | 500 | 服务器内部错误 |

---

## 认证相关接口

### 1. 用户注册

**接口地址**: `POST /api/auth/register`

**请求参数**:
```json
{
  "username": "用户昵称",
  "phone": "手机号",
  "password": "密码"
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户昵称，2-50个字符 |
| phone | string | 是 | 手机号，11位数字 |
| password | string | 是 | 密码，6-20个字符 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "测试用户",
      "phone": "13800138000",
      "isNewUser": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

### 2. 用户登录

**接口地址**: `POST /api/auth/login`

**请求参数**:
```json
{
  "phone": "手机号",
  "password": "密码"
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| password | string | 是 | 密码 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "测试用户",
      "phone": "13800138000",
      "isNewUser": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

### 3. 获取用户信息

**接口地址**: `GET /api/auth/profile`

**请求头**: 需要JWT认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "测试用户",
    "phone": "13800138000",
    "isNewUser": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 积分系统接口

### 1. 获取积分账户

**接口地址**: `GET /api/points/account`

**请求头**: 需要JWT认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "balance": 150,
    "totalEarned": 300,
    "totalUsed": 150,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. 获取本周签到配置

**接口地址**: `GET /api/points/weekly-config`

**请求头**: 需要JWT认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "weekStartDate": "2024-01-01T00:00:00.000Z",
    "basePoints": 10,
    "day1Multiplier": 1.0,
    "day2Multiplier": 1.5,
    "day3Multiplier": 1.0,
    "day4Multiplier": 1.5,
    "day5Multiplier": 1.0,
    "day6Multiplier": 0.6,
    "day7Multiplier": 2.0,
    "bonusDay": 4,
    "bonusCoupon": "满29减4",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. 获取签到状态

**接口地址**: `GET /api/points/signin-status`

**请求头**: 需要JWT认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "signedToday": false,
    "signedDays": [1, 2, 3],
    "canSignIn": true,
    "consecutiveDays": 3,
    "weeklySignIns": {
      "monday": true,
      "tuesday": true,
      "wednesday": true,
      "thursday": false,
      "friday": false,
      "saturday": false,
      "sunday": false
    }
  }
}
```

### 4. 执行签到

**接口地址**: `POST /api/points/signin`

**请求头**: 需要JWT认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "pointsEarned": 15,
    "newBalance": 165,
    "multiplier": 1.5,
    "dayOfWeek": 2,
    "isBonus": false,
    "bonusCoupon": null,
    "signInRecord": {
      "id": "uuid",
      "userId": "uuid",
      "signInDate": "2024-01-02T00:00:00.000Z",
      "dayOfWeek": 2,
      "pointsEarned": 15,
      "multiplier": 1.5,
      "isBonus": false,
      "isMakeUp": false,
      "makeUpCost": 0
    }
  },
  "message": "签到成功，获得15积分！"
}
```

### 5. 补签

**接口地址**: `POST /api/points/makeup`

**请求头**: 需要JWT认证

**请求参数**:
```json
{
  "date": "2024-01-01",
  "type": "points" // 或 "order"
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | string | 是 | 补签日期，格式YYYY-MM-DD |
| type | string | 是 | 补签方式：points(积分补签) 或 order(下单补签) |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "pointsEarned": 10,
    "pointsCost": 5,
    "newBalance": 160,
    "signInRecord": {
      "id": "uuid",
      "isMakeUp": true,
      "makeUpCost": 5
    }
  },
  "message": "补签成功"
}
```

---

## 团队系统接口

### 1. 创建团队

**接口地址**: `POST /api/team/create`

**请求头**: 需要JWT认证

**请求参数**:
```json
{
  "name": "团队名称"
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 团队名称，最大50字符 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "team": {
      "id": "uuid",
      "captainId": "uuid",
      "name": "我的团队",
      "inviteCode": "ABC123456",
      "startTime": "2024-01-01T10:00:00.000Z",
      "endTime": "2024-01-01T13:00:00.000Z",
      "totalPoints": 100,
      "status": "active",
      "createdAt": "2024-01-01T10:00:00.000Z"
    },
    "member": {
      "id": "uuid",
      "teamId": "uuid",
      "userId": "uuid",
      "role": "captain",
      "isNewUser": false,
      "pointsEarned": 0,
      "joinedAt": "2024-01-01T10:00:00.000Z"
    }
  },
  "message": "团队创建成功"
}
```

### 2. 加入团队

**接口地址**: `POST /api/team/join`

**请求头**: 需要JWT认证

**请求参数**:
```json
{
  "inviteCode": "邀请码"
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| inviteCode | string | 是 | 团队邀请码 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "team": {
      "id": "uuid",
      "name": "我的团队",
      "captainId": "uuid",
      "memberCount": 2,
      "remainingTime": 7200
    },
    "member": {
      "id": "uuid",
      "role": "member",
      "pointsEarned": 50,
      "isNewUser": true,
      "newUserBonus": 10
    },
    "pointsAwarded": {
      "member": 60,
      "captain": 10
    }
  },
  "message": "加入团队成功"
}
```

### 3. 获取我的团队

**接口地址**: `GET /api/team/my-team`

**请求头**: 需要JWT认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "team": {
      "id": "uuid",
      "captainId": "uuid",
      "name": "我的团队",
      "inviteCode": "ABC123456",
      "startTime": "2024-01-01T10:00:00.000Z",
      "endTime": "2024-01-01T13:00:00.000Z",
      "totalPoints": 100,
      "status": "active",
      "memberCount": 3,
      "remainingTime": 3600
    },
    "members": [
      {
        "id": "uuid",
        "userId": "uuid",
        "username": "队长",
        "role": "captain",
        "pointsEarned": 40,
        "isNewUser": false,
        "joinedAt": "2024-01-01T10:00:00.000Z"
      },
      {
        "id": "uuid",
        "userId": "uuid",
        "username": "队员1",
        "role": "member",
        "pointsEarned": 30,
        "isNewUser": true,
        "joinedAt": "2024-01-01T10:30:00.000Z"
      }
    ],
    "myRole": "captain",
    "myPointsEarned": 40
  }
}
```

### 4. 刷新邀请码

**接口地址**: `PUT /api/team/refresh`

**请求头**: 需要JWT认证

**说明**: 只有队长可以刷新邀请码

**响应示例**:
```json
{
  "success": true,
  "data": {
    "inviteCode": "XYZ789012",
    "team": {
      "id": "uuid",
      "name": "我的团队",
      "remainingTime": 3600
    }
  },
  "message": "邀请码刷新成功"
}
```

### 5. 离开团队

**接口地址**: `DELETE /api/team/leave`

**请求头**: 需要JWT认证

**说明**: 队长离开会解散团队

**响应示例**:
```json
{
  "success": true,
  "data": {
    "teamDisbanded": false,
    "pointsRefunded": 0
  },
  "message": "已离开团队"
}
```

---

## 奖励系统接口

### 1. 获取商品列表

**接口地址**: `GET /api/reward/items`

**请求头**: 需要JWT认证

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| stage | number | 否 | 阶段筛选，1或2 |
| available | boolean | 否 | 只显示有库存的商品 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "currentStage": 1,
    "stage2Unlocked": false,
    "items": [
      {
        "id": "uuid",
        "name": "满29减4优惠券",
        "description": "购物满29元可减4元",
        "pointsCost": 5,
        "couponType": "满29减4",
        "couponValue": 4,
        "conditionAmount": 29,
        "stock": 100,
        "stage": 1,
        "isLimited": false,
        "isActive": true,
        "canExchange": true
      }
    ]
  }
}
```

### 2. 兑换商品

**接口地址**: `POST /api/reward/exchange`

**请求头**: 需要JWT认证

**请求参数**:
```json
{
  "rewardItemId": "商品ID",
  "quantity": 1
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| rewardItemId | string | 是 | 商品ID |
| quantity | number | 否 | 兑换数量，默认1 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "record": {
      "id": "uuid",
      "userId": "uuid",
      "rewardItemId": "uuid",
      "pointsCost": 5,
      "rewardName": "满29减4优惠券",
      "couponType": "满29减4",
      "status": "completed",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "newBalance": 145,
    "coupon": {
      "id": "uuid",
      "userId": "uuid",
      "couponType": "满29减4",
      "couponValue": 4,
      "conditionAmount": 29,
      "source": "积分兑换",
      "expiryDate": "2024-01-31T23:59:59.000Z",
      "status": "active",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "stageProgress": {
      "stage1Completed": false,
      "stage2Unlocked": false,
      "remainingItems": 5
    }
  },
  "message": "兑换成功"
}
```

### 3. 获取阶段信息

**接口地址**: `GET /api/reward/stage-info`

**请求头**: 需要JWT认证

**响应示例**:
```json
{
  "success": true,
  "data": {
    "currentStage": 1,
    "stage2Unlocked": false,
    "stage1Progress": {
      "totalItems": 6,
      "exchangedItems": 3,
      "completionRate": 0.5
    },
    "nextStageRequirement": "兑换完第一阶段全部商品"
  }
}
```

---

## 优惠券接口

### 1. 获取我的优惠券

**接口地址**: `GET /api/coupon/my`

**请求头**: 需要JWT认证

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态筛选：active/used/expired |
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "couponType": "满29减4",
        "couponValue": 4,
        "conditionAmount": 29,
        "source": "积分兑换",
        "expiryDate": "2024-01-31T23:59:59.000Z",
        "status": "active",
        "usedAt": null,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "daysUntilExpiry": 30
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "summary": {
      "active": 3,
      "used": 1,
      "expired": 1,
      "totalValue": 12
    }
  }
}
```

### 2. 使用优惠券

**接口地址**: `POST /api/coupon/use`

**请求头**: 需要JWT认证

**请求参数**:
```json
{
  "couponId": "优惠券ID",
  "orderAmount": 35.00
}
```

**参数说明**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| couponId | string | 是 | 优惠券ID |
| orderAmount | number | 是 | 订单金额 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "coupon": {
      "id": "uuid",
      "couponType": "满29减4",
      "couponValue": 4,
      "conditionAmount": 29,
      "status": "used",
      "usedAt": "2024-01-01T15:00:00.000Z"
    },
    "discount": 4,
    "finalAmount": 31.00
  },
  "message": "优惠券使用成功"
}
```

---

## 记录查询接口

### 1. 获取积分记录

**接口地址**: `GET /api/points/records`

**请求头**: 需要JWT认证

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 类型筛选：earn/use/expire |
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |
| startDate | string | 否 | 开始日期，格式YYYY-MM-DD |
| endDate | string | 否 | 结束日期，格式YYYY-MM-DD |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "type": "earn",
        "amount": 15,
        "description": "每日签到",
        "relatedId": "uuid",
        "balanceAfter": 165,
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "summary": {
      "totalEarned": 200,
      "totalUsed": 50,
      "totalExpired": 0
    }
  }
}
```

### 2. 获取签到记录

**接口地址**: `GET /api/signin/records`

**请求头**: 需要JWT认证

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |
| month | string | 否 | 月份筛选，格式YYYY-MM |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "signInDate": "2024-01-01T00:00:00.000Z",
        "dayOfWeek": 1,
        "pointsEarned": 10,
        "multiplier": 1.0,
        "isBonus": false,
        "isMakeUp": false,
        "makeUpCost": 0,
        "createdAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "statistics": {
      "totalDays": 15,
      "consecutiveDays": 5,
      "totalPoints": 180,
      "bonusReceived": 2
    }
  }
}
```

### 3. 获取团队记录

**接口地址**: `GET /api/team/records`

**请求头**: 需要JWT认证

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |
| status | string | 否 | 状态筛选：active/completed/expired |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "teamId": "uuid",
        "teamName": "我的团队",
        "role": "captain",
        "pointsEarned": 40,
        "isNewUser": false,
        "joinedAt": "2024-01-01T10:00:00.000Z",
        "teamStatus": "completed",
        "memberCount": 3,
        "teamDuration": 10800
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "statistics": {
      "totalTeams": 5,
      "ascaptain": 2,
      "asMember": 3,
      "totalPointsEarned": 150
    }
  }
}
```

### 4. 获取兑换记录

**接口地址**: `GET /api/reward/records`

**请求头**: 需要JWT认证

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |
| status | string | 否 | 状态筛选：pending/completed/failed |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "rewardItemId": "uuid",
        "pointsCost": 5,
        "rewardName": "满29减4优惠券",
        "couponType": "满29减4",
        "status": "completed",
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "summary": {
      "totalExchanges": 10,
      "totalPointsUsed": 80,
      "successfulExchanges": 9,
      "failedExchanges": 1
    }
  }
}
```

---

## 工具接口

### 1. 健康检查

**接口地址**: `GET /api/health`

**说明**: 用于检查API服务状态

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "database": "connected"
}
```

### 2. 服务器时间

**接口地址**: `GET /api/time`

**说明**: 获取服务器当前时间

**响应示例**:
```json
{
  "success": true,
  "data": {
    "serverTime": "2024-01-01T12:00:00.000Z",
    "timezone": "UTC",
    "timestamp": 1704110400000
  }
}
```

### 3. 系统配置

**接口地址**: `GET /api/config`

**说明**: 获取系统公开配置信息

**响应示例**:
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "environment": "production",
    "features": {
      "teamSystem": true,
      "rewardSystem": true,
      "couponSystem": true
    },
    "limits": {
      "maxTeamMembers": 3,
      "teamDurationHours": 3,
      "maxCouponsPerUser": 50
    }
  }
}
```

---

## 接口调用示例

### JavaScript/TypeScript 示例

```typescript
// 基础配置
const API_BASE_URL = 'https://pufen-api.render.com';

// 封装请求函数
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || '请求失败');
  }
  
  return data.data;
}

// 使用示例
async function userLogin(phone: string, password: string) {
  try {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
    
    // 保存token
    localStorage.setItem('token', result.token);
    
    return result.user;
  } catch (error) {
    console.error('登录失败:', error.message);
    throw error;
  }
}

// 签到示例
async function performSignIn() {
  try {
    const result = await apiRequest('/api/points/signin', {
      method: 'POST',
    });
    
    console.log(`签到成功，获得${result.pointsEarned}积分`);
    return result;
  } catch (error) {
    console.error('签到失败:', error.message);
    throw error;
  }
}

// 获取积分记录
async function getPointsRecords(page = 1, type?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '20',
    ...(type && { type }),
  });
  
  return apiRequest(`/api/points/records?${params}`);
}
```

### cURL 示例

```bash
# 用户登录
curl -X POST \
  https://pufen-api.render.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "phone": "13800138000",
    "password": "123456"
  }'

# 获取积分账户 (需要token)
curl -X GET \
  https://pufen-api.render.com/api/points/account \
  -H 'Authorization: Bearer your_jwt_token'

# 执行签到
curl -X POST \
  https://pufen-api.render.com/api/points/signin \
  -H 'Authorization: Bearer your_jwt_token'

# 创建团队
curl -X POST \
  https://pufen-api.render.com/api/team/create \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_jwt_token' \
  -d '{
    "name": "我的团队"
  }'
```

---

## 更新日志

### v1.0.0 (2024-01-01)
- ✅ 基础认证系统
- ✅ 积分签到功能
- ✅ 团队组队系统
- ✅ 奖励兑换功能
- ✅ 优惠券系统
- ✅ 记录查询接口

### 计划更新
- 📋 消息通知接口
- 📋 数据统计接口
- 📋 管理员接口
- 📋 批量操作接口

---

## 联系我们

如有接口问题或建议，请通过以下方式联系：

- **GitHub Issues**: [https://github.com/yryjzz/PUFen/issues](https://github.com/yryjzz/PUFen/issues)
- **项目地址**: [https://github.com/yryjzz/PUFen](https://github.com/yryjzz/PUFen)

---

*最后更新时间: 2024年12月*
