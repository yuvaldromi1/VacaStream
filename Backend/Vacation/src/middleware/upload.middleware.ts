import multer, { Multer } from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import { ValidationError } from "@yd/restify";
import { getUploadsDir } from "../utils/image-helpers";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, getUploadsDir());
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, uuid() + ext);
    }
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const allowedTypes = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new ValidationError("Only image files are allowed (jpg, jpeg, png, gif, webp)."));
    }
};

export const uploadMiddleware: Multer = multer({ storage, fileFilter });
