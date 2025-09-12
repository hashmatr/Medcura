import mongoose from 'mongoose'
const connectDB = async()=>{
    mongoose.connection.on('connected',()=>console.log('DataBase has been connected'))
 await mongoose.connect(`${process.env.MONGODB_URI}`)
}
export default connectDB;