import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";

import prisma from "@lib/prismadb";
import { signinSchema } from "@lib/validation";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
    newUser: "/sign-up",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: "app-signin",
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = signinSchema.parse(credentials);
        const result = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!result) {
          return null;
        }

        const isValid = await verify(result.password, password);

        if (!isValid) {
          return null;
        }

        return { id: result.id };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
