import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/messages';
import { signAccessToken } from '../utils/jwt';
import { IUser } from '../interfaces/user.interface';

interface LoginResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: IUser['role'];
  };
}

export class AuthService {
  async login(email: string, password: string, userType: string): Promise<LoginResult> {
    const user = await userRepository.findByEmailAndType(email, userType, true);

    if (!user) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!user.active) {
      throw ApiError.forbidden(MESSAGES.AUTH.ACCOUNT_INACTIVE);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}

export const authService = new AuthService();
