require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// Express app
const app = express()           

const connectDB = require('./db/index.js')

const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')

connectDB()
.then(()=>{
   app.listen(process.env.PORT || 4000,()=>{
     console.log(`Server is running on port ${process.env.PORT}`);
   })
})
.catch((err)=>{
  console.log(`MONGO DB connection Failed !!!!`,err);
})

//middleware
app.use(express.json())   
app.use(cors({
  origin:"*"
}))

// Routes
app.use('/api/workouts',workoutRoutes)
app.use('/api/user',userRoutes)