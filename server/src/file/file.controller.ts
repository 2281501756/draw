import { Body, Controller, Post } from '@nestjs/common';
import { Get, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file,
    @Body('userName') userName,
    @Body('photo') photo,
  ) {
    return this.fileService.uploadUserImage(file.filename, userName, photo);
  }
  @Get('works')
  works() {
    return this.fileService.getwork();
  }
}
