import { sign, verify } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  roleId: string | null;
}
export class TokenUtil {
  static generateToken(payload: TokenPayload): string {
    return sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  static verifyToken(token: string): TokenPayload {
    return verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  }
}
