import { Request, Response } from 'express';
import { query } from '../config/database';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { isValidEmail, validateRequiredFields } from '../utils/validator';
import emailService from '../services/email.service';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const countResult = await query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      'SELECT id, email, name, avatar, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return paginatedResponse(res, result.rows, { page, limit, total });
  } catch (error) {
    console.error('Get users error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to fetch users',
      500
    );
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, email, name, avatar, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to fetch user',
      500
    );
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, avatar } = req.body;

    const validation = validateRequiredFields(req.body, ['email', 'name']);
    if (!validation.valid) {
      return errorResponse(
        res,
        `Missing required fields: ${validation.missing.join(', ')}`,
        400
      );
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 'Invalid email address', 400);
    }

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'User with this email already exists', 409);
    }

    const result = await query(
      'INSERT INTO users (email, name, avatar) VALUES ($1, $2, $3) RETURNING id, email, name, avatar, created_at, updated_at',
      [email, name, avatar || null]
    );

    await emailService.sendWelcomeEmail(email, name);

    return successResponse(res, result.rows[0], 'User created successfully', 201);
  } catch (error) {
    console.error('Create user error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to create user',
      500
    );
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, avatar } = req.body;

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name) {
      fields.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (avatar !== undefined) {
      fields.push(`avatar = $${paramCount++}`);
      values.push(avatar);
    }

    if (fields.length === 0) {
      return errorResponse(res, 'No fields to update', 400);
    }

    fields.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, email, name, avatar, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, result.rows[0], 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to update user',
      500
    );
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to delete user',
      500
    );
  }
};
