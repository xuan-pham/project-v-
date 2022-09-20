import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/api/mail/mail.service';
import { PostService } from 'src/api/post/post.service';

@Processor('process')
export class BullsProcess {
  constructor(
    private mailService: MailService,
    private postService: PostService,
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
    const [nameFilesImages, nameFilesVideos] = await Promise.all([
      job.data.files.images.map(({ filename }) => {
        return filename;
      }, []),
      job.data.files.videos.map(({ filename }) => {
        return filename;
      }, []),
    ]);
    const idProcess = job.data.idProcess;
    const post = {
      author: job.data.id,
      title: job.data.data.title,
      image: nameFilesImages,
      videos: nameFilesVideos,
    };
    await this.postService.store(+idProcess, post);
  }
}

// const [nameFilesImages, nameFilesVideos] = await Promise.all([
//   files.images.map(({ filename }) => {
//     return filename;
//   }, []),
//   files.videos.map(({ filename }) => {
//     return filename;
//   }, []),
// ]);
