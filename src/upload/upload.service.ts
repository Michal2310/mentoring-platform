import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { AWSError, S3 } from 'aws-sdk';
import { Images } from '@prisma/client';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  private async uploadToS3(
    dataBuffer: Buffer,
    fileName: string,
  ): Promise<S3.ManagedUpload.SendData> {
    const s3 = new S3();
    const random = randomBytes(8).toString('hex');
    return await s3
      .upload({
        Bucket: this.config.get('AWS_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${random}-${fileName}`,
        ACL: 'public-read',
      })
      .promise();
  }

  private async deleteFromS3(
    key: string,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    try {
      const s3 = new S3();
      return await s3
        .deleteObject({
          Bucket: this.config.get('AWS_BUCKET_NAME'),
          Key: key,
        })
        .promise();
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(dataBuffer: Buffer, fileName: string, userId: number): Promise<Images> {
    try {
      const uploadResult = await this.uploadToS3(dataBuffer, fileName);
      const imageExists = await this.prisma.images.findUnique({
        where: { userId },
      });
      if (imageExists) {
        await this.deleteFromS3(imageExists.key);
        return this.prisma.images.update({
          where: {
            userId,
          },
          data: {
            fileName: fileName,
            fileUrl: uploadResult.Location,
            key: uploadResult.Key,
          },
        });
      }
      return await this.prisma.images.create({
        data: {
          fileName: fileName,
          fileUrl: uploadResult.Location,
          key: uploadResult.Key,
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deletePhoto(userId: number): Promise<{ message: string }> {
    try {
      const { key } = await this.prisma.images.findUnique({
        where: { userId },
        select: { key: true },
      });
      await this.deleteFromS3(key);
      await this.prisma.images.delete({ where: { userId } });
      return { message: 'Image deleted' };
    } catch (error) {
      throw error;
    }
  }
}
