import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (user && user.password && (await bcrypt.compare(credentials.password, user.password))) {
                    return { id: user.id, name: user.name, email: user.email };
                }

                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {

        async jwt({ token, user }) {
     
            if (user) {
                token.id = user.id; 
            }
            return token;
        },

   
        async session({ session, token }) {
  
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    
    events: {
        async createUser({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };