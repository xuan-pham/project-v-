import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/api/mail/mail.service';
import { PostService } from 'src/api/post/post.service';
import { ProcessRepository } from '../../api/process/process.repository';

@Processor('process')
export class BullsProcess {
  constructor(
    private mailService: MailService,
    private postService: PostService,
    private processRepository: ProcessRepository
  ) {}

  //Process SendMail
  @Process('mail')
  async handleMessage(job: Job) {
    return this.mailService.sendUserConfirmation(job.data);
  }

  @Process('forgot')
  async handleForgot(job: Job) {
    return this.mailService.sendPassConfirmation(job.data);
  }

  //process Post uploads image
  @Process('image')
  async handleImage(job: Job) {
    const idProcess = job.data.idProcess;
    try {
      const [nameFilesImages, nameFilesVideos] = await Promise.all([
        job.data.files.images.map(({ filename }) => {
          return filename;
        }, []),
        job.data.files.videos.map(({ filename }) => {
          return filename;
        }, []),
      ]);
      const post = {
        author: job.data.id,
        title: job.data.data.title,
        image: nameFilesImages,
        videos: nameFilesVideos,
      };
      const postBull = await this.postService.store(post);
      if (postBull) {
        const status = {
          status: 'Done',
          log: {},
        };
        await this.processRepository.update(+idProcess, status);
      }
    } catch (error) {
      if (error) {
        const status = {
          status: 'Error',
          log: error.message,
        };
        await this.processRepository.update(+idProcess, status);
      }
    }
  }
}
