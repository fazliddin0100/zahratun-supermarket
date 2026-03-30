import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

interface Env {
  GOOGLE_ID: string;
  GOOGLE_SECRET: string;
}

declare const process: {
  env: Env;
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
