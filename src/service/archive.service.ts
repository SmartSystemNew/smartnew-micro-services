import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

export const createExcelTemp = {
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return cb(
        new Error('Tipo de arquivo inválido. Envie um arquivo Excel.'),
        false,
      );
    }
    cb(null, true);
  },
};
