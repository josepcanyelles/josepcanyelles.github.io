import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export interface UploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any[];
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  tags?: string[];
}

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: string | Buffer,
    options?: UploadOptions
  ): Promise<UploadApiResponse> {
    try {
      const uploadOptions = {
        folder: options?.folder || 'koetica',
        public_id: options?.public_id,
        transformation: options?.transformation,
        resource_type: options?.resource_type || 'auto',
        tags: options?.tags || [],
      };

      let result: UploadApiResponse;

      if (typeof file === 'string') {
        // File path or URL
        result = await cloudinary.uploader.upload(file, uploadOptions);
      } else {
        // Buffer - convert to base64
        const base64File = `data:image/png;base64,${file.toString('base64')}`;
        result = await cloudinary.uploader.upload(base64File, uploadOptions);
      }

      console.log('File uploaded to Cloudinary:', result.public_id);
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file to Cloudinary');
    }
  }

  async uploadImage(
    file: string | Buffer,
    folder?: string,
    transformations?: any[]
  ): Promise<UploadApiResponse> {
    return this.uploadFile(file, {
      folder,
      resource_type: 'image',
      transformation: transformations,
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('File deleted from Cloudinary:', publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete file from Cloudinary');
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<any> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      console.log('Multiple files deleted from Cloudinary');
      return result;
    } catch (error) {
      console.error('Cloudinary bulk delete error:', error);
      throw new Error('Failed to delete files from Cloudinary');
    }
  }

  getOptimizedUrl(publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }): string {
    return cloudinary.url(publicId, {
      width: options?.width,
      height: options?.height,
      crop: options?.crop || 'fill',
      quality: options?.quality || 'auto',
      format: options?.format || 'auto',
      fetch_format: 'auto',
    });
  }

  getThumbnailUrl(publicId: string, size: number = 200): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'thumb',
      quality: 'auto',
    });
  }

  async getResourceInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary resource info error:', error);
      throw new Error('Failed to get resource info from Cloudinary');
    }
  }

  async listResources(folder?: string, maxResults: number = 100): Promise<any> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: maxResults,
      });
      return result;
    } catch (error) {
      console.error('Cloudinary list resources error:', error);
      throw new Error('Failed to list resources from Cloudinary');
    }
  }
}

export default new CloudinaryService();
