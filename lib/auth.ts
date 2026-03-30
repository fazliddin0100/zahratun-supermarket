// lib/auth.ts
import dbConnect from '@/lib/mongodb';
import User from '@/modules/Account';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email yoki Telefon', type: 'text' },
        password: { label: 'Parol', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Email/Telefon va parol kiritilishi kerak');
        }

        await dbConnect();

        const user = await User.findOne({
          $or: [
            { email: credentials.identifier },
            { phoneNumber: credentials.identifier },
          ],
        }).select('+password');

        if (!user) {
          throw new Error('Foydalanuvchi topilmadi');
        }

        if (user.provider === 'google') {
          throw new Error(
            'Bu hisob Google orqali yaratilgan. Google bilan kiring'
          );
        }

        const isPasswordValid = await user.matchPassword(credentials.password);
        if (!isPasswordValid) {
          throw new Error("Parol noto'g'ri");
        }

        user.lastLogin = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          // name: user.name,
          email: user.email || '',
          // image: user.image || null,
          role: user.role,
          phoneNumber: user.phoneNumber,
        } as any;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const existingUser = await User.findOne({
            $or: [
              { email: user.email },
              { googleId: account.providerAccountId },
            ],
          });
          if (existingUser) {
            if (
              existingUser.provider === 'credentials' &&
              !existingUser.googleId
            ) {
              existingUser.googleId = account.providerAccountId;
              existingUser.image = user.image || existingUser.image;
              existingUser.emailVerified = new Date();
              await existingUser.save();
            }

            existingUser.lastLogin = new Date();
            await existingUser.save();

            user.id = existingUser._id.toString();
            user.role = existingUser.role;
            user.phoneNumber = existingUser.phoneNumber;
          } else {
            // Yangi Google foydalanuvchi yaratish
            const newUser = await User.create({
              // name: user.name,
              email: user.email,
              // image: user.image,
              provider: 'google',
              googleId: account.providerAccountId,
              emailVerified: new Date(),
              isVerified: true,
              role: 'customer',
              lastLogin: new Date(),
            });

            user.id = newUser._id.toString();
            user.role = newUser.role;
          }

          return true;
        } catch (error) {
          console.error('Google sign in error:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phoneNumber = user.phoneNumber;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phoneNumber = token.phoneNumber as string;
      }

      return session;
    },
  },

  pages: {
    signIn: '/',
    error: '/',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
