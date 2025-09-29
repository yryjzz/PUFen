export const registerBodyDto = {
  type: 'object',
  required: ['username', 'phone', 'password'],
  properties: {
    username: { type: 'string', minLength: 1, maxLength: 50 },
    phone: { type: 'string', pattern: '^1[3-9]\\d{9}$' },
    password: { type: 'string', minLength: 6 },
  },
} as const;

export const loginBodyDto = {
  type: 'object',
  required: ['phone', 'password'],
  properties: {
    phone: { type: 'string', pattern: '^1[3-9]\\d{9}$' },
    password: { type: 'string', minLength: 6},
  },
} as const;