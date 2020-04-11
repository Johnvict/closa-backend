"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require('multer');
const sharp = require('sharp');
const exported_classes_1 = require("./../app/exported.classes");
class FileController {
    constructor() {
        this.logoDir = 'public/img/logo';
        this.avatarDir = 'public/img/avatar';
        this.fileDir = 'public/file/job-sample';
        this.locationImageDir = 'public/location';
        // ? This doesn't  allow image resize
        // avatarStorage = multer.diskStorage({
        // 	destination: (req, file, cb) => {
        // 		cb(null, this.avatarDir)
        // 	},
        // 	filename: (req, file, cb) => {
        // 		const ext = file.mimetype.split('/')[1]
        // 		req.body.avatar = `user-${req.agent.phone}.${ext}`
        // 		cb(null, req.body.avatar)
        // 	}
        // });
        // ? This allows us to resize image
        this.multterStorage = multer.memoryStorage();
        this.fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                console.log('IT GOT HERE SAFELY', file);
                cb(null, this.fileDir);
            },
            filename: (req, file, cb) => {
                const ext = file.mimetype.split('/')[1];
                req.body.fileUrl = `file/job-sample/job-${req.agent.phone}-${req.params.job_sample_id}.${ext}`;
                cb(null, `job-${req.agent.phone}-${req.params.job_sample_id}.${ext}`);
            }
        });
        this.imageFilter = (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true);
            }
            else {
                cb(new exported_classes_1.AppError('invalid file formart', 400, -1), false);
            }
        };
        this.fileFilter = (req, file, cb) => {
            if (file.mimetype == 'application/pdf') {
                cb(null, true);
            }
            else {
                cb(new exported_classes_1.AppError('invalid file format', 400, -1), false);
            }
        };
    }
    uploadFile(fileType) {
        switch (fileType) {
            case 'avatar':
                return multer({
                    storage: this.multterStorage,
                    fileFilter: this.imageFilter
                }).single('avatar');
                break;
            case 'logo':
                return multer({
                    storage: this.multterStorage,
                    fileFilter: this.imageFilter
                }).single('logo');
                break;
            case 'location':
                return multer({
                    storage: this.multterStorage,
                    fileFilter: this.imageFilter
                }).single('image');
                break;
            case 'file':
                return multer({
                    storage: this.fileStorage,
                    fileFilter: this.fileFilter
                }).single('file');
                // return multer({ dest: this.logoDir}).single('file')
                break;
            default:
                break;
        }
    }
    resizeAvatar(req, res, next) {
        if (!req.file)
            return next();
        // const ext = req.file.mimetype.split('/')[1]
        req.body.avatar = `img/avatar/user-${req.agent.phone}.jpg`;
        req.file.filename = `public/img/avatar/user-${req.agent.phone}.jpg`;
        sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpg')
            .jpeg({ quality: 90 })
            .toFile(req.file.filename);
        next();
    }
    resizeLogo(req, res, next) {
        if (!req.file)
            return next();
        // const ext = req.file.mimetype.split('/')[1]
        req.body.logo = `img/logo/business-${req.agent.phone}.jpg`;
        req.file.filename = `public/img/logo/business-${req.agent.phone}.jpg`;
        sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpg')
            .jpeg({ quality: 90 })
            .toFile(req.file.filename);
        next();
    }
    resizeLocation(req, res, next) {
        if (!req.file)
            return next();
        const ext = req.file.mimetype.split('/')[1];
        req.body.image = `location/location-${req.agent.phone}.${ext}`;
        req.file.filename = `public/location/location-${req.agent.phone}.${ext}`;
        sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat(ext)
            .jpeg({ quality: 90 })
            .toFile(req.file.filename);
        next();
    }
}
exports.FileController = FileController;
