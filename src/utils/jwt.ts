// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export function generateToken(cognitoSub: string) {
  return jwt.sign({ sub: cognitoSub }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
