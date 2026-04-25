import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  private uploadsDir = path.join(process.cwd(), 'uploads');

  async optimizeImage(inputFile: string,): Promise<string> {
    const inputPath = path.join(this.uploadsDir, inputFile,);

    const outputFile = `optimized-${Date.now()}-${path.basename(inputFile)}`;
    const outputPath = path.join(this.uploadsDir, outputFile,);

    const buffer = await fs.readFile(inputPath);

    await sharp(buffer)
      .resize(800, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(outputPath);

    await fs.unlink(inputPath).catch(() => { });

    return outputFile;
  }

  async deleteIfExists(file?: string | null) {
    if (!file) return;

    const filePath = path.join(this.uploadsDir, file);
    await fs.unlink(filePath).catch(() => { });
  }
}
