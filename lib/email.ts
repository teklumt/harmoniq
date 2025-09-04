"use server";
import nodemailer from "nodemailer";
import { generatePasswordResetEmail } from "../components/email-component";

export async function sendEmail({
  to,
  subject,
  resetUrl,
  userEmail,
  text,
}: {
  to: string;
  subject: string;
  resetUrl?: string;
  userEmail?: string;
  text?: string;
}) {
  if (!process.env.SMTP_host || !process.env.SMTP_port || !process.env.SMTP_user || !process.env.SMTP_pass) {
    throw new Error("Missing SMTP environment variables");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_host,
    port: parseInt(process.env.SMTP_port, 10),
    secure: process.env.SMTP_port === "465",
    auth: {
      user: process.env.SMTP_user,
      pass: process.env.SMTP_pass,
    },
  });

  let htmlContent: string | undefined;
  let textContent: string | undefined = text;

  // Password reset email
  if (resetUrl && userEmail) {
    const expiryTime = "1 hour";
    htmlContent = generatePasswordResetEmail({ resetUrl, userEmail, expiryTime });

    textContent = `
Harmoniq Password Reset

Hello,

We received a request to reset the password for your Harmoniq account (${userEmail}).
Reset your password here: ${resetUrl}

This link expires in ${expiryTime}.
If you didn’t request this, please ignore this email.

© ${new Date().getFullYear()} Harmoniq. All rights reserved.
    `;
  }
  // Verification / generic email
  else if (text) {
    const link = text.split(": ")[1];
    htmlContent = `
      <h1>Welcome to Harmoniq 🎶</h1>
      <p>Please verify your email by clicking below:</p>
      <a href="${link}">Verify Email</a>
      <p>Or paste this link into your browser: ${link}</p>
    `;
  } else {
    throw new Error("Either text or resetUrl/userEmail must be provided");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Harmoniq" <${process.env.SMTP_user}>`,
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      text: textContent?.trim(),
      html: htmlContent?.trim(),
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, message: error.response || "Failed to send email." };
  }
}
