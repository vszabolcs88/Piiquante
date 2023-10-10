const express = require('express');
const userRouter = express.Router();
const userCtrl = require('../controllers/user');
const password = require('../middleware/password');

userRouter.post('/signup',password, userCtrl.signup);
userRouter.post('/login', userCtrl.login);

module.exports = userRouter;