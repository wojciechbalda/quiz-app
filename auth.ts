import NextAuth from "next-auth"
import Github from 'next-auth/providers/github'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Github],
  adapter: PrismaAdapter(prisma),
  session: {strategy: 'jwt'},
  callbacks: {
    jwt({token, user})
    {
      if (user)
      {
          token.id = user.id
      }
      return token
    },
    session({session, token}) {
      session.user.id = token.id as string || '';
      return session
    }
  }
})