import express from "express";
const router = express.Router();
import multer from "multer";

const base = process.env.NODE_ENV !== "production" ? `http://localhost:${process.env.PORT}/`
                                                   : `https://${process.env.DOMAIN}:${process.env.HTTPS_PORT}/`;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})
const upload = multer({ storage: storage });

router.post('/', upload.single("file"), function (req: any, res) {
    console.log("router.post(/file: " + base + req.file.path)
    res.status(200).send({ url: base + req.file.path })
});

export default router;
