const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

function generateHash(filename) {
    return crypto.createHash('md5').update(filename).digest('hex');
}

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
        const hash = generateHash(file.originalname);
        cb(null, hash + path.extname(file.originalname));
    },

});

const fileFilterConfig = (req, file, cb) => {
    const isPhoto = file.mimetype.startsWith('image/');
    // const isvideo = file.mimetype.startsWith('video/');
    if (isPhoto) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storageConfig,
    fileFilter: fileFilterConfig,
});

module.exports = { upload };