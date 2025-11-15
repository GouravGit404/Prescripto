import express from 'express'
import cors from 'cors'
import 'dotenv/config' 


import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();
const  port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json())
app.use(cors());




// api endpoints for admin

app.use('/api/admin',adminRouter);

//  api endpoints for doctor

app.use('/api/doctor', doctorRouter);

// api endpoints for user

app.use('/api/user', userRouter);


// testing endpoint

app.get('/',(req,res)=>{
res.send('API Working')
})

app.listen(port, ()=>console.log("Server Started at port",port));