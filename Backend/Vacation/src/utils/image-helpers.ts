import fs from "fs";
import path from "path";

const uploadsDir = path.join(__dirname, "..", "uploads");

// Ensure uploads directory exists:
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

export function getUploadsDir(): string {
    return uploadsDir;
}

export function getImagePath(imageFileName: string): string {
    return path.join(uploadsDir, imageFileName);
}

export function deleteImage(imageFileName: string): void {
    const filePath = getImagePath(imageFileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
