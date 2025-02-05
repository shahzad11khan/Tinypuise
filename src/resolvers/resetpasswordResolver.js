const User = require('../models/user');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter (e.g., for Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Use SSL for secure connection
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Error:', error);
  } else {
    console.log('SMTP connected:', success);
  }
});

const resolvers ={
     Mutation: {
        generateResetToken: async (_, { email }) => {
          try {
            const user = await User.findOne({ email });
            if (!user) {
              throw new Error('User not found');
            }
        
            // Generate a reset token
            const resetToken = user.generateRefreshToken();
            const resetOTP = user.generateRefreshOtp();
            console.log(resetOTP)
            await user.save();
        
            // Construct the password reset URL
            let resetURL =`${process.env.CLIENT_URL_ADMIN}/reset-password-token/${resetToken}`;
           
        
            // Email options
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'Password Reset Request',
              text: `You requested a password reset. Please use the link below to reset your password:\n\n${resetURL}\n\nYour OTP is: ${resetOTP}`, 
              html: `
                <p>You requested a password reset. Please click the link below to reset your password:</p>
                <a href="${resetURL}" target="_blank">${resetURL}</a>
                <p><strong>Your OTP is:</strong> ${resetOTP}</p>
              `,
            };
        
            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error('Email Sending Error:', error);
                throw new Error('Failed to send email');
              }
              console.log('Email sent:', info.response);
            });
          } catch (error) {
            console.error('Server Error:', error);
            throw new Error('Failed to send email');          }
          },
          resetPassword: async (_, { token,resetOTP, newPassword, confirmPassword }) => {
            try {
              const user = await User.findOne({ refreshToken: token });
             const refreshPTO = await User.findOne({ refreshOTP: resetOTP });
           if(!token ){
               throw new Error('Provide Token');
           }
             if (!user) {
               throw new Error('PInvalid or expired token');
             }
         
             if(!refreshPTO){
               throw new Error('Invalid OTP');

             }
           if(!resetOTP ){
               throw new Error('Provide ResetOTP');
           }
             if (newPassword !== confirmPassword) {
               throw new Error('Passwords do not match');

             }
             // Find the user by the refresh token
           
             // Update the user's password
             user.password = newPassword;
             user.confirmPassword = newPassword;
         
             // Clear the refresh token after successful password reset
             user.refreshToken = null;
             user.refreshOTP = null;
             await user.save();
         
            //  res.status(200).json({ message: 'Password reset successfully'});
           } catch (error) {
             throw new Error('error');

           }
          },
    
    },
   
}

module.exports = resolvers;