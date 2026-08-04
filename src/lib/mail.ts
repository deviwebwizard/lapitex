import nodemailer from "nodemailer";

// Using Ethereal for testing - this catches emails so we can view them in browser
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  // Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: '"Lapitex Support" <support@lapitex.com>', // sender address
    to: email, // list of receivers
    subject: "Reset your Lapitex Password", // Subject line
    text: `Click the following link to reset your password: ${resetUrl}`, // plain text body
    html: `
      <div style="font-family: sans-serif; max-w-md; margin: 0 auto; padding: 20px; background: #fff0f5; border-radius: 10px;">
        <h2 style="color: #e1467c;">Lapitex - Reset Your Password</h2>
        <p>You requested to reset your password. Click the button below to set a new one:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #e1467c, #f472a8); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Reset Password</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  return info;
}
