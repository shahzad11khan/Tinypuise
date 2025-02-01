const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// // Configure Nodemailer transporter (e.g., for Gmail SMTP)
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER, // Your email address
//       pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
//     },
//   });
// // Generate a Password Reset Token
// exports.generateResetToken = async (req, res) => {
//     const { email } = req.body;
  
//     try {
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Generate a refresh token
//       const resetToken = user.generateRefreshToken();
//       await user.save();
  
//       // Construct the password reset UR
//       let
//         resetURL = `${process.env.CLIENT_URL_MOBILE}/reset-password/${resetToken}`;
  
//       // Send the email
//       const mailOptions = {
//         from: process.env.EMAIL_USER, // Sender email
//         to: email, // Recipient email
//         subject: 'Password Reset Request',
//         text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetURL}`,
//         html: `<p>You requested a password reset. Please click the link below to reset your password:</p><a href="${resetURL}" target="_blank">${resetURL}</a>`,
//       };
  
//       await transporter.sendMail(mailOptions);
  
//       res.status(200).json({ message: 'Password reset link sent to your email' });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };

// // Reset Password
// exports.resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword, confirmPassword } = req.body;

//   try {
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     // Find the user by the refresh token
//     const user = await User.findOne({ refreshToken: token });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // Update the user's password
//     user.password = await bcrypt.hash(newPassword, 10);
//     user.confirmPassword = newPassword;

//     // Clear the refresh token after successful password reset
//     user.clearRefreshToken();
//     await user.save();

//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const resolvers ={
     Mutation: {
        generateResetToken: async (_, { email }) => {
            try {
              const user = await User.findOne({ email });
      
              if (!user) {
                return { message: 'User not found' };
              }
              // Construct the password reset URL
              const resetURL = `https://tinypuise.vercel.app/reset-password?token=${resetToken}`;
      
              // Send the email
              const mailOptions = {
                from: process.env.EMAIL_USER, // Sender email
                to: email, // Recipient email
                subject: 'Password Reset Request',
                text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetURL}`,
                html: `<p>You requested a password reset. Please click the link below to reset your password:</p><a href="${resetURL}" target="_blank">${resetURL}</a>`,
              };
      
              await transporter.sendMail(mailOptions);
             // Generate a refresh token
             const resetToken = user.generateRefreshToken();
             await user.save();
              return { message: 'Password reset link sent to your email' };
            } catch (error) {
              throw new Error(`Error generating reset token: ${error.message}`);
            }
          },
          resetPassword: async (_, { token,newPassword, confirmPassword }) => {
            try {
              if (newPassword !== confirmPassword) {
                return { message: 'Passwords do not match' };
              }
          
              // Find the user by the refresh token
              const user = await User.findOne({ refreshToken: token });
          
              if (!user) {
                return { message: 'Invalid or expired token' };
              }
          
              // Update the user's password
              user.password = await bcrypt.hash(newPassword, 10);
              user.confirmPassword = newPassword;
          
              // Clear the refresh token after successful password reset
              user.clearRefreshToken();
              await user.save();
          
              return { message: 'Password reset successfully' };
            } catch (error) {
              throw new Error(`Error resetting password: ${error.message}`);
            }
          },
    
    },
   
}

module.exports = resolvers;