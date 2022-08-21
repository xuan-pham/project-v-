import { diskStorage } from 'multer';
const { v4: uuidv4 } = require('uuid');
export const storagePost = {
  storage: diskStorage({
    destination: './uploads/posts',
    filename(req, file, callback) {
      const filename: string = uuidv4() + file.originalname.replace(/\s/g, '');
      callback(null, `${filename}`);
    },
  }),
};
