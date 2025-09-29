// src/types/fastify.d.ts
import { User } from '../entities/User';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}