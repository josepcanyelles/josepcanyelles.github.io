import { Response } from 'express';
import { MulterRequest } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import cloudinaryService from '../services/cloudinary.service';

export const uploadImage = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const folder = req.body.folder || 'koetica';

    const result = await cloudinaryService.uploadImage(
      req.file.buffer,
      folder
    );

    const responseData = {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      thumbnailUrl: cloudinaryService.getThumbnailUrl(result.public_id),
    };

    return successResponse(res, responseData, 'Image uploaded successfully', 201);
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to upload image',
      500
    );
  }
};

export const deleteImage = async (req: MulterRequest, res: Response) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return errorResponse(res, 'Public ID is required', 400);
    }

    await cloudinaryService.deleteFile(publicId);

    return successResponse(res, null, 'Image deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to delete image',
      500
    );
  }
};

export const getImageInfo = async (req: MulterRequest, res: Response) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return errorResponse(res, 'Public ID is required', 400);
    }

    const info = await cloudinaryService.getResourceInfo(publicId);

    return successResponse(res, info);
  } catch (error) {
    console.error('Get image info error:', error);
    return errorResponse(
      res,
      error instanceof Error ? error.message : 'Failed to get image info',
      500
    );
  }
};
