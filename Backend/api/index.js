import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import adminRouter from '../routes/adminRoute.js';
import doctorRouter from '../routes/doctorRoute.js';
import userRouter from '../routes/UserRoutes.js';
import paymentRouter from '../routes/PaymentRoute.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken']
}));

// MongoDB connection with caching for serverless
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

// Cloudinary configuration
const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
};

// Initialize connections
connectCloudinary();

// Middleware to ensure DB connection on each request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Failed to connect to database:', error);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Medcura API is Working!' });
});

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Export for Vercel
export default app;
