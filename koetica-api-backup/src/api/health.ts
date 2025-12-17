import { Request, Response } from 'express';
import { successResponse } from '../utils/response';
import pool from '../config/database';
import emailService from '../services/email.service';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    return successResponse(res, health);
  } catch (error) {
    return successResponse(res, {
      status: 'error',
      timestamp: new Date().toISOString(),
    }, undefined, 500);
  }
};

export const databaseHealth = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    return successResponse(res, {
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    return successResponse(res, {
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, undefined, 500);
  }
};

export const emailHealth = async (req: Request, res: Response) => {
  try {
    const isConnected = await emailService.verifyConnection();
    return successResponse(res, {
      status: isConnected ? 'ok' : 'error',
      email: isConnected ? 'connected' : 'disconnected',
    });
  } catch (error) {
    return successResponse(res, {
      status: 'error',
      email: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, undefined, 500);
  }
};
