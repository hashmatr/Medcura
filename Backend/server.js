import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/UserRoutes.js';
import paymentRouter from './routes/PaymentRoute.js';
const app = express();
const port = process.env.PORT|| 4000
connectDB()
connectCloudinary()
app.use(express.json())
app.use(cors())
app.use('/api/admin',adminRouter)
app.get('/',(req,res)=>{
    res.send('APi is Working')
})
app.use('/api/doctor',doctorRouter ) 
app.use('/api/user',userRouter )
app.use('/api/payment', paymentRouter);

app.listen(port,()=>{
    console.log('Listening.....');
})
