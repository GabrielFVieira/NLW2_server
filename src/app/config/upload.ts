import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: path.resolve(__dirname, '..', '..', 'uploads'),
	filename: (req, file, cb) => {
		const fileNameWithoutSpaces = file.originalname.replace(/\s/g, '_');
		const ext = path.extname(fileNameWithoutSpaces);
		const name = req.userId;

		cb(null, `${name}${ext}`);
	},
});

export default { storage };
