import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { Express } from 'express';

export const imageUploadConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: (
        error: Error | null,
        filename: string,
      ) => void,
    ) => {
      const uniqueSuffix =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9);

      callback(
        null,
        uniqueSuffix + extname(file.originalname),
      );
    },
  }),

  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (
      error: Error | null,
      acceptFile: boolean,
    ) => void,
  ) => {
    const allowed = /\/(jpg|jpeg|png|webp)$/;

    if (!file.mimetype.match(allowed)) {
      return callback(
        new Error('Only image files allowed'),
        false,
      );
    }

    callback(null, true);
  },

  limits: {
    fileSize: 1024 * 1024,
  },
};
