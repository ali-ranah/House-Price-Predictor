const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../Model/userModel');
const GoogleUser = require('../Model/googleUser');
const sendEmail = require('../utils/emailUtils');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            // If username or email already exists, send a response indicating the conflict
            return res.status(409).json({ message: 'Email already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the user with the hashed password
        const user = await User.create({ name, email, password: hashedPassword });
         // Generate a verification token (no expiration)
         const verificationToken = jwt.sign(
            { userId: user._id, email },
            process.env.JWT_SECRET
        );

        // Save the verification token to the database
        user.verificationToken = verificationToken;
        await user.save();

        // Send verification email
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email',
            type:'account_verification',
            name: user.name,
            verificationLink
        });

        res.status(201).json({ message: 'Sign-up successful. Please verify your email.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log(token);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
        if (!tokenId) {
            return res.status(400).json({ message: 'Token ID is required' });
        }

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log('Payload', payload);
        const { email, sub: googleId,name,picture } = payload;

        // Check if a GoogleUser exists
        let googleUser = await GoogleUser.findOne({ email });

        if (!googleUser) {
            googleUser = new GoogleUser({ email, googleId,name,picture });
            await googleUser.save();
        }
        const token = jwt.sign({ userId: googleUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token',token);

        res.status(200).json({ message: 'Login successful', payload, token });
    } catch (error) {
        console.error('Google login error:', error);

        if (error.message === 'Invalid token') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(500).json({ message: 'Internal server error', error });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('name email picture createdAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getReceiverInfo = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name email picture createdAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateOwnInformation = async (req, res) => {
    try {
      const id = req.user.userId; 
      const { name, email, newPassword, currentPassword } = req.body; // Accept current password
      let image = req.body.image || null;
  
      // Fetch the user by ID
      const currentUser = await User.findById(id);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Build the update object dynamically
      let updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      
      // If the user wants to update the password, verify the current password first
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to update your password.' });
        }
  
        // Compare the provided current password with the stored password
        const isPasswordMatch = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isPasswordMatch) {
          return res.status(401).json({ message: 'Current password is incorrect.' });
        }
  
        // Hash and update the new password
        updateFields.password = await bcrypt.hash(newPassword, 10);
      }
  
      if (image && image !== currentUser.image) {
        updateFields.picture = image;
      }
  
      // Update the user with only the provided fields
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true } // Return the updated document
      );  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.getGoogleUserInfo = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await GoogleUser.findById(userId).select('name email picture');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Function to generate a random 6-digit number
const generateRandomCode = () => {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Controller function for the forgot password endpoint
exports.forgotPassword = async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a random verification code
        const verificationCode = generateRandomCode();

        // Set the verification code and expiry time
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = Date.now() + 5 * 60 * 1000; // Code expires in 5 minutes

        await user.save();
        try {
             await sendEmail({
              email: user.email,
              subject: 'Password Reset Request',
              verificationCode,
              type: 'verify',
              name: user.name,
            });
            res.status(200).json({ message: 'Verification code sent successfully' });
          } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending verification code' });
          }
          
        
    } catch (error) {
        console.error('Forgot password failed:', error);
        res.status(500).json({ message: 'Forgot password failed' });
    }
};

// Controller function for the reset password endpoint
exports.resetPassword = async (req, res) => {
    try {
        const { email, verificationCode, newPassword } = req.body;

        // Find user by email and verification code
        const user = await User.findOne({ email, verificationCode });
        if (!user) {
            return res.status(404).json({ message: 'Invalid Verification Code' });
        }

        // Check if verification code is expired
        if (user.verificationCodeExpiry < Date.now()) {
            return res.status(400).json({ message: 'Verification Code Expired' });
        }

        // Reset password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save();
        await sendEmail({
             email: user.email,
             subject: 'Password Reset Successful',
             type: 'reset',
             name: user.name,
           });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset failed:', error);
        res.status(500).json({ message: 'Password reset failed' });
    }
};

exports.resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new verification code and expiry date
        user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCodeExpiry = Date.now() + 5 * 60 * 1000; // Expiry in 5 minutes
        await user.save();

        // Send verification email
        try {
            await sendEmail({
             email: user.email,
             subject: 'Password Reset Request',
             verificationCode:  user.verificationCode,
             type: 'verify',
             name: user.name,
           });
           res.status(200).json({ message: 'Verification code sent successfully' });
         } catch (error) {
           console.error('Error sending email:', error);
           res.status(500).json({ message: 'Error sending verification code' });
         }
    } catch (error) {
        console.error('Failed to resend verification code:', error);
        res.status(500).json({ message: 'Failed to resend verification code' });
    }
};

// Verify email
exports.verifyEmail = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user
        const user = await User.findOne({ _id: decoded.userId, verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        // Update the user's verification status
        user.isVerified = true;
        user.verificationToken = null; // Clear the token
        await user.save();
         // Send verification success email
         await sendEmail({
            email: user.email,
            subject: 'Email Verified Successfully',
            type: 'verification_success',
            name: user.name,
        });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(400).json({ message: 'Invalid token' });
    }
};