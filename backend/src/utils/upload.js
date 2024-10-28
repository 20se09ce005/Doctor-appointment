const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

function generateHash(filename) {
    return crypto.createHash('md5').update(filename).digest("hex");
}

function createUploadMiddleware(destinationFolder) {
    
    const storageConfig = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationFolder);
        },
        filename: (req, file, cb) => {
            const hash = generateHash(file.originalname);
            cb(null, hash + path.extname(file.originalname));
        }
    });
    return multer({
        storage: storageConfig,
        limits: {
            fileSize: 1000000000
        },
    });
}
module.exports = {
   uploadImage:createUploadMiddleware("uploads/images"),
};