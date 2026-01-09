import multer from "multer";

// Use memory storage for serverless environments (Vercel)
// Files will be available as buffer in req.file.buffer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

export default upload;