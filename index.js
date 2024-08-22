import express from 'express';
import mongoose from 'mongoose';
import { userRoute } from './services/users.service.js';
import cors from 'cors'
import dotenv from "dotenv"
import { balanceRouter } from './services/account.js';
import { appUsersRoute } from './services/users.js';


const app = express();
dotenv.config();
mongoose.connect("mongodb://localhost:27017,localhost:27018,localhost:27019/paytmwallet?replicaSet=rs0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Successfully connected to the database');
  }).catch((error) => {
    console.error('Error connecting to the database', error);
  });
  

mongoose.connection.on("open" , () =>{
    console.log("db connected!")
})

mongoose.connection.on("error" , () =>{
    console.log("error")
})
app.use(cors())
app.use(express.json())

app.use("/api/v1" ,userRoute );
app.use("/api/v1/account", balanceRouter);
app.use("/api/v1/users",appUsersRoute)
app.listen(4000 , () =>{
    console.log("app started!")
})