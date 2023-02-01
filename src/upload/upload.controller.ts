import {
  Controller,
  Delete,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from '../common/decorators';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpeg|png)/ })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
  ) {
    return await this.uploadService.uploadFile(file.buffer, file.originalname, userId);
  }

  @Delete('')
  deletePhoto(@GetCurrentUserId() userId: number) {
    return this.uploadService.deletePhoto(userId);
  }
}
