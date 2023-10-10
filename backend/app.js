const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const stuffRoutes = require('./routes/sauces');
const userRouter = require('./routes/user');

const app = express();

//helmet middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin" }));

//connecting to mongoDB
mongoose.connect(process.env.connection_url)
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Setting up rate limits
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: 'Too many requests!'
})

//to it
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(hpp());
app.use(limiter);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', limiter, userRouter);

module.exports = app;