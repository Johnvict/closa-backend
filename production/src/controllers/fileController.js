"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const multer = require('multer');
// const sharp = require('sharp');
let multer;
let sharp;
class FileController {
    constructor() {
        // multerStorage = multer.diskStorage({
        // 	destination: (req, file, cb) => {
        // 		cb(null, 'public/img/logo')
        // 	},
        // 	fileName: (req, file, cb) => {
        // 		const ext = file.mimetype.split('/')[1]
        // 		cb(null, `logo-${'business_name'}-${Date.now()}.${ext}`)
        // 	}
        // })
        // We use this instead because we want to resize image
        // thie file will now be in req.file.buffer
        this.multerStorage = multer.memoryStorage();
        this.multerFilter = (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true);
            }
            else {
                return cb('invalid file formart', false);
            }
        };
        this.upload = multer({
            storage: this.multerStorage,
            fileFilter: this.multerFilter
        });
        // Middleware
        this.uploadBusinessLogo = this.upload.single('logo');
    }
    // save Image
    saveImageToDB(req, res, next) {
        let fileName;
        if (req.file)
            fileName = req.file.filename;
        // ...
    }
    resizeImage(req, res, next) {
        if (!req.file)
            next();
        req.file.filename = `logo-${'business_name'}-${Date.now()}.jpeg`;
        sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/logo/${req.file.filename}`);
        next();
    }
}
exports.FileController = FileController;
