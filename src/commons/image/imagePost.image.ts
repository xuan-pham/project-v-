import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
export const storagePost = {
  storage: diskStorage({
    destination: './uploads/posts/images',
    filename(req, file, callback) {
      const filename: string = uuidv4() + file.originalname.replace(/\s/g, '');
      callback(null, `${filename}`);
    },
  }),
};
