import prisma from '../config/database.js';
import { hashPassword, comparePassword, generateToken, generateRefreshToken } from '../utils/auth.js';
import { ERROR_MESSAGES } from '../constants/index.js';

export class AuthService {
  async register(data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }) {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error(ERROR_MESSAGES.DUPLICATE_ENTRY);
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: 'CASHIER', // Default role
      },
    });

    return this.formatUserResponse(user);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new Error('User account is not active');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        loginAttempts: 0,
      },
    });

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      branchId: user.branchId || undefined,
    });

    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Log activity
    await this.logActivity(user.id, 'LOGIN', 'User logged in successfully');

    return {
      user: this.formatUserResponse(user),
      token,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const record = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = record.user;

    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      branchId: user.branchId || undefined,
    });

    return {
      token: newToken,
      user: this.formatUserResponse(user),
    };
  }

  async logout(userId: string) {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    await this.logActivity(userId, 'LOGOUT', 'User logged out');
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    }

    const validPassword = await comparePassword(oldPassword, user.passwordHash);
    if (!validPassword) {
      throw new Error('Current password is incorrect');
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  private formatUserResponse(user: any) {
    const { passwordHash, twoFactorSecret, ...rest } = user;
    return rest;
  }

  private async logActivity(userId: string, action: string, details?: string) {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
      },
    });
  }
}

export default new AuthService();
