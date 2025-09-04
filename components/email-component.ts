interface PasswordResetEmailProps {
  resetUrl: string;
  userEmail: string;
  expiryTime: string;
}

export function generatePasswordResetEmail({ resetUrl, userEmail, expiryTime }: PasswordResetEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password - Harmoniq</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f9fafb; color:#333; margin:0; padding:0; }
    .container { max-width:600px; margin:20px auto; background:#fff; border-radius:12px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,.05); }
    h1 { color:#f97316; font-size:22px; }
    .btn { display:inline-block; background:#f97316; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:bold; }
    .footer { font-size:12px; color:#777; margin-top:30px; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Harmoniq Password 🎶</h1>
    <p>Hello,</p>
    <p>We received a request to reset the password for your account <strong>${userEmail}</strong>.</p>
    <p><a href="${resetUrl}" class="btn">Reset Password</a></p>
    <p>This link will expire in ${expiryTime}. If you didn’t request this, you can safely ignore it.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Harmoniq Music. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
}
