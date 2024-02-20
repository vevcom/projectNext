import { Adapter } from "next-auth/adapters";
import type { PrismaClient } from "@prisma/client";
import create from "@/actions/users/create";

export default function PrismaAdapter(prisma : PrismaClient) : Adapter {
  return {
    async createUser(user) {
        // Must refactor
        const ret = await prisma.user.create({
            data: {
                user.username,
                user.email,
                user.firstname,
                user.lastname,
            }
        })
      },
      async getUser(id) {
        return
      },
      async getUserByEmail(email) {
        return
      },
      async getUserByAccount({ providerAccountId, provider }) {
        return
      },
      async updateUser(user) {
        return
      },
      async deleteUser(userId) {
        return
      },
      async linkAccount(account) {
        return
      },
      async unlinkAccount({ providerAccountId, provider }) {
        return
      },
      async createSession({ sessionToken, userId, expires }) {
        return
      },
      async getSessionAndUser(sessionToken) {
        return
      },
      async updateSession({ sessionToken }) {
        return
      },
      async deleteSession(sessionToken) {
        return
      },
      async createVerificationToken({ identifier, expires, token }) {
        return
      },
      async useVerificationToken({ identifier, token }) {
        return
      },
  };
}