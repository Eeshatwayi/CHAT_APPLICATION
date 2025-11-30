const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Request password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Send email
    const message = `
      You requested a password reset. Click the link below to reset your password:
      
      ${resetUrl}
      
      This link expires in 10 minutes.
      
      If you didn't request this, please ignore this email.
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: message
    });

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};