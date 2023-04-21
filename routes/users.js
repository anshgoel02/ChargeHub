import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();
import catchAsync from '../utils/catchAsync.js';
import passport from 'passport';
import * as user from '../controllers/users.js';

router.route('/register')
    .get(user.registerForm)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), user.loginUser)

router.get('/logout', user.logoutUser);

export default router;