import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class BullsService {
  constructor(@InjectQueue('process') private processQueue: Queue) {}

  //process sendMail
  async sendMailBull(data: string) {
    return this.processQueue.add('mail', data);
  }

  async sendForgotBull(data: string) {
    return this.processQueue.add('forgot', data);
  }
  //End process sendMail

  //process Post uploads image
  async uploadsImage(
    id: number,
    data: string,
    files?: { images: Express.Multer.File[]; videos: Express.Multer.File[] },
  ) {
    const post = {
      id,
      data,
      files,
    };
    await this.processQueue.add('image', post);
    return;
  }

  //End process Post uploads image
}
