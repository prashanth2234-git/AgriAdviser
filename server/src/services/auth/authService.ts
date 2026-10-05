import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../../db';
import { env } from '../../config/env';
import {
  RegisterInput,
  LoginInput,
  ProfileUpdateInput,
  PreferencesUpdateInput,
} from '../../../../shared/schemas/advisory';
import { UserRecord, UserPreferencesRecord } from '../../../../shared/types';

export class AuthService {
  static signToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  static async register(input: RegisterInput): Promise<{ user: UserRecord; token: string }> {
    const db = await getDb();

    // Check existing
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [input.email]);
    if (existing.rows.length > 0) {
      const err: any = new Error('An account with this email address already exists');
      err.statusCode = 409;
      err.code = 'EMAIL_ALREADY_EXISTS';
      throw err;
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    return await db.transaction(async (tx) => {
      const userRes = await tx.query<UserRecord>(
        `INSERT INTO users (
          email, password_hash, full_name, phone, preferred_language, location
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, full_name, phone, preferred_language, location,
                  farming_experience_years, farm_size_acres, primary_crops,
                  irrigation_type, farming_method, created_at, updated_at`,
        [
          input.email,
          passwordHash,
          input.fullName,
          input.phone || null,
          input.preferredLanguage || 'en',
          input.location || null,
        ]
      );

      const user = userRes.rows[0];

      // Create preferences
      await tx.query(
        `INSERT INTO user_preferences (user_id, preferred_language)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO NOTHING`,
        [user.id, input.preferredLanguage || 'en']
      );

      const token = AuthService.signToken(user.id, user.email);
      return { user, token };
    });
  }

  static async login(input: LoginInput): Promise<{ user: UserRecord; token: string }> {
    const db = await getDb();

    const userRes = await db.query(
      `SELECT id, email, password_hash, full_name, phone, preferred_language,
              location, farming_experience_years, farm_size_acres, primary_crops,
              irrigation_type, farming_method, created_at, updated_at
       FROM users WHERE email = $1`,
      [input.email]
    );

    if (userRes.rows.length === 0) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const rawUser = userRes.rows[0];
    const isPasswordValid = await bcrypt.compare(input.password, rawUser.password_hash);
    if (!isPasswordValid) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const { password_hash, ...user } = rawUser;
    const token = AuthService.signToken(user.id, user.email);

    return { user: user as UserRecord, token };
  }

  static async getCurrentUser(userId: string): Promise<UserRecord | null> {
    const db = await getDb();
    const res = await db.query<UserRecord>(
      `SELECT id, email, full_name, phone, preferred_language, location,
              farming_experience_years, farm_size_acres, primary_crops,
              irrigation_type, farming_method, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    return res.rows[0] || null;
  }

  static async updateProfile(userId: string, input: ProfileUpdateInput): Promise<UserRecord> {
    const db = await getDb();
    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [userId];

    if (input.fullName !== undefined) {
      params.push(input.fullName);
      updates.push(`full_name = $${params.length}`);
    }
    if (input.phone !== undefined) {
      params.push(input.phone || null);
      updates.push(`phone = $${params.length}`);
    }
    if (input.preferredLanguage !== undefined) {
      params.push(input.preferredLanguage);
      updates.push(`preferred_language = $${params.length}`);
    }
    if (input.location !== undefined) {
      params.push(input.location || null);
      updates.push(`location = $${params.length}`);
    }
    if (input.farmingExperienceYears !== undefined) {
      params.push(input.farmingExperienceYears ?? null);
      updates.push(`farming_experience_years = $${params.length}`);
    }
    if (input.farmSizeAcres !== undefined) {
      params.push(input.farmSizeAcres ?? null);
      updates.push(`farm_size_acres = $${params.length}`);
    }
    if (input.primaryCrops !== undefined) {
      params.push(input.primaryCrops);
      updates.push(`primary_crops = $${params.length}`);
    }
    if (input.irrigationType !== undefined) {
      params.push(input.irrigationType || null);
      updates.push(`irrigation_type = $${params.length}`);
    }
    if (input.farmingMethod !== undefined) {
      params.push(input.farmingMethod || null);
      updates.push(`farming_method = $${params.length}`);
    }

    const sql = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING id, email, full_name, phone, preferred_language, location,
                farming_experience_years, farm_size_acres, primary_crops,
                irrigation_type, farming_method, created_at, updated_at
    `;

    const res = await db.query<UserRecord>(sql, params);
    if (res.rows.length === 0) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    return res.rows[0];
  }

  static async getPreferences(userId: string): Promise<UserPreferencesRecord> {
    const db = await getDb();
    let res = await db.query<UserPreferencesRecord>(
      `SELECT id, user_id, preferred_language, notifications_enabled, email_notifications, created_at, updated_at
       FROM user_preferences WHERE user_id = $1`,
      [userId]
    );

    if (res.rows.length === 0) {
      // Create defaults
      res = await db.query<UserPreferencesRecord>(
        `INSERT INTO user_preferences (user_id)
         VALUES ($1)
         RETURNING id, user_id, preferred_language, notifications_enabled, email_notifications, created_at, updated_at`,
        [userId]
      );
    }

    return res.rows[0];
  }

  static async updatePreferences(userId: string, input: PreferencesUpdateInput): Promise<UserPreferencesRecord> {
    const db = await getDb();
    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [userId];

    if (input.preferredLanguage !== undefined) {
      params.push(input.preferredLanguage);
      updates.push(`preferred_language = $${params.length}`);
    }
    if (input.notificationsEnabled !== undefined) {
      params.push(input.notificationsEnabled);
      updates.push(`notifications_enabled = $${params.length}`);
    }
    if (input.emailNotifications !== undefined) {
      params.push(input.emailNotifications);
      updates.push(`email_notifications = $${params.length}`);
    }

    const sql = `
      UPDATE user_preferences
      SET ${updates.join(', ')}
      WHERE user_id = $1
      RETURNING id, user_id, preferred_language, notifications_enabled, email_notifications, created_at, updated_at
    `;

    const res = await db.query<UserPreferencesRecord>(sql, params);
    if (res.rows.length === 0) {
      // Insert if not yet created
      const insertRes = await db.query<UserPreferencesRecord>(
        `INSERT INTO user_preferences (user_id, preferred_language, notifications_enabled, email_notifications)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, preferred_language, notifications_enabled, email_notifications, created_at, updated_at`,
        [
          userId,
          input.preferredLanguage || 'en',
          input.notificationsEnabled ?? true,
          input.emailNotifications ?? false,
        ]
      );
      return insertRes.rows[0];
    }

    return res.rows[0];
  }
}
