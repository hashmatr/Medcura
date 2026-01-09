import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/UserRoutes.js';
import paymentRouter from './routes/PaymentRoute.js';

const app = express();
const port = process.env.PORT || 4000

// MongoDB connection with caching for serverless
let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

        await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
        });
        isConnected = true;
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

// Initialize Cloudinary
connectCloudinary();

// Middleware
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken'],
    credentials: true
}))

// Database connection middleware for serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('DB connection failed:', error);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Medcura API is Working!' })
})

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// Start server for local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
}

// Export for Vercel serverless
export default app;
