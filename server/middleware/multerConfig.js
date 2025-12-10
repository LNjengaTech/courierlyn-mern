//multer configuration to define where files are stored and what file types are allowed.

const multer = require('multer');
const path = require('path');

// 1. Define storage location and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Make sure this 'uploads/services' folder exists in your server root!
        cb(null, 'uploads/services'); 
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.ext (e.g., image-1678888888888.jpg)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// 2. File Filter (Security: Only allow specific image types)
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        // Accept file
        return cb(null, true);
    } else {
        // Reject file (Security Alert)
        cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'), false);
    }
};

// 3. Initialize Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
});

module.exports = upload;