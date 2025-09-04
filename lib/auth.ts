import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma/client";
import { sendEmail } from "./email";
import { createAuthMiddleware, APIError } from "better-auth/api";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user", // Default role for new users
        input: false, // Prevent users from setting role during signup
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        resetUrl: `${url}?token=${token}`,
        userEmail: user.email,
      });
    },
  },
  // auth.ts
  emailVerification: {
    enabled: true,
    // sendOnSignUp: true,
    // autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("Sending verification email to:", user.email , "I am called here ");
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Please click the following link to verify your email: ${url}`,
      });
    },
    afterEmailVerification: async () => {
      console.log(`Email verified for user:`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    },
  },
  rateLimit: {
    window: 60,
    max: 10,
  },
});