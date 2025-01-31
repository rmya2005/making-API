require('dotenv').config()
const PORT = process.env.PORT
const express = require('express')
const router = require('./routes/index')
const authRouter = require('./routes/auth');


const app = express()

app.use(express.json());
app.use('/api',router)
app.use('/api/auth', authRouter);


const start = ()=>{
    try{
       app.listen(PORT,()=>{
           console.log(`Server stated on port:${PORT}`);
       })
    }
    catch (e) {
        console.log(e);
    }
}

start()