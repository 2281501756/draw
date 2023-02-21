import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {} from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}
  async uploadUserImage(fileName: string, userName: string, photo: string) {
    let res = await this.prisma.work.create({
      data: {
        userName,
        photo,
        data: '/static/upload/' + fileName,
      },
    });
    return res;
  }
  async getwork() {
    return await this.prisma.work.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
