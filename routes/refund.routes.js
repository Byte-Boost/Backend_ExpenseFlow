const controller = require('../controllers/refund.controller.js');
const router = require('express').Router();

const multer = require("multer")
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../userdata/receipt");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function ( req, file , cb){
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})
const upload = multer({storage: storage, fileFilter: (req, file, cb) =>{
    const allowedTypes = /jpeg|jpg|png/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowedTypes.test(ext)) {
            return cb(new Error("Only images are allowed"), false);
        }
        cb(null, true);
    }
})

router.post('/',controller.createRefund);
router.post('/expense', upload.single('file'), controller.createExpense);

router.patch('/:id/close', controller.closeRefund);
router.patch('/:id/authorize', controller.authRefund);

router.get('/', controller.getRefunds);
router.get('/:id', controller.getRefundById);
router.get('/expense/:id', controller.getExpenseById);

module.exports = router;