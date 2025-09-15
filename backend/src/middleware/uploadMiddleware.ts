import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (_, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });
