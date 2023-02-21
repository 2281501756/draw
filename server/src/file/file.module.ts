import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileService } from './file.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../public/upload'),
        filename: (_, file, callback) => {
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
    PrismaModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
