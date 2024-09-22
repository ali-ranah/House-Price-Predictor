const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const authMiddleware = require('../Middleware/AuthMiddleware/AuthMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.post('/forgot-password', userController.forgotPassword);
router.get('/get-user-info',authMiddleware,userController.getUserInfo);
router.get('/get-google-user-info',authMiddleware,userController.getGoogleUserInfo);
router.post('/reset-password', userController.resetPassword);
router.post('/resend-verification', userController.resendVerificationCode);




module.exports = router;
