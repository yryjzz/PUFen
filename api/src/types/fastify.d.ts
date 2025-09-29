// src/types/fastify.d.ts
import { User } from '../entities/User.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}