import { Router } from 'express';
import { healthCheck, databaseHealth, emailHealth } from '../api/health';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../api/users';
import { uploadImage, deleteImage, getImageInfo } from '../api/upload';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Health check routes
router.get('/health', healthCheck);
router.get('/health/database', databaseHealth);
router.get('/health/email', emailHealth);

// User routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Upload routes
router.post('/upload', uploadSingle, uploadImage);
router.delete('/upload', deleteImage);
router.get('/upload/:publicId', getImageInfo);

export default router;
