import { User } from './user.entity'; // 假设你有一个 User 实体

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        email: string;
      }; // 假设你有一个 `User` 类型
      language: string;
    }
  }
}
