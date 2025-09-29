import bcrypt from 'bcrypt';

export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, 10);
};