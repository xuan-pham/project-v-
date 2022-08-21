import { diskStorage } from 'multer';
const { v4: uuidv4 } = require('uuid');
export const storage = {
  storage: diskStorage({
    destination: './uploads/profile',
    filename(req, file, callback) {
      const filename: string = uuidv4() + file.originalname.replace(/\s/g, '');
      callback(null, `${filename}`);
    },
  }),
};
