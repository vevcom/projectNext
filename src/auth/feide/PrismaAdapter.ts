import { Adapter, AdapterUser } from "next-auth/adapters";
import type { PrismaClient } from "@prisma/client";
import { nextAuthUserFields } from "./Types";

type NextAuthAdapterUser = Omit<AdapterUser, 'emailVerified' | 'id'> & { id: number }

function addALotOfFrustrationWithNextAuth(user : NextAuthAdapterUser) : AdapterUser {
  return {
    ...user,
    emailVerified: null,
    id: String(user.id)
  }
}

function addSomeMoreFrustrationWithNextAuth(user : NextAuthAdapterUser | null | undefined) : AdapterUser | null {
  if (user === null || user === undefined) {
    return null;
  }
  return addALotOfFrustrationWithNextAuth(user);
}

const selectUserFields = nextAuthUserFields.reduce((prev, field) => ({
  ...prev,
  [field]: true
}), {} as {[key in typeof nextAuthUserFields[number]]: true })

export default function PrismaAdapter(prisma : PrismaClient): Adapter {
  return {

    async createUser(user: Omit<AdapterUser, 'id'>) : Promise<AdapterUser> {
      // REFACTOR
      const ret = await prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
        select: selectUserFields
      });
      
      return addALotOfFrustrationWithNextAuth(ret);
    },

    async getUser(id : string | number) : Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id)
        },
        select: selectUserFields
      });

      return addSomeMoreFrustrationWithNextAuth(user);
    },

    async getUserByEmail(email : string) : Promise<AdapterUser | null> {
      console.log("Next auth is trying to get a user by email???")
      const user = await prisma.user.findUnique({
        where: {
          email
        },
        select: selectUserFields
      });
      return addSomeMoreFrustrationWithNextAuth(user);
    },

    async getUserByAccount({ providerAccountId, provider } : {providerAccountId: string, provider: string}) : Promise<AdapterUser | null> {
      if (provider !== "feide") {
        console.log(provider);
        throw new Error("Unsupported provider");
      }

      const user = await prisma.feideAccount.findUnique({
        where: {
          id: providerAccountId
        },
        select: {
          user: {
            select: selectUserFields
          }
        }
      });

      return addSomeMoreFrustrationWithNextAuth(user?.user);
    },

    async updateUser(user : Partial<AdapterUser> & Pick<AdapterUser, "id">) : Promise<AdapterUser> {
      console.warn("Next auth is trying to update a user???");

      console.log(user);

      const ret = await prisma.user.findUnique({
        where: {
          id: Number(user.id)
        },
        select: selectUserFields
      });

      return addSomeMoreFrustrationWithNextAuth(ret) as AdapterUser;
    },
    async deleteUser(userId) {
      throw Error("Delete user from next uath is not implemented");
    },
    async linkAccount(account) {
      return
    },
    async unlinkAccount({ providerAccountId, provider }) {
      throw Error("Unlink account from next auth is not implemented");
    },
    async createSession({ sessionToken, userId, expires }) {
      throw Error("Create session from next auth is not implemented");
    },
    async getSessionAndUser(sessionToken) {
      throw Error("Get session and user from next auth is not implemented");
    },
    async updateSession({ sessionToken }) {
      throw Error("Update session from next auth is not implemented");
    },
    async deleteSession(sessionToken) {
      throw Error("Delete session from next auth is not implemented");
    },
    async createVerificationToken({ identifier, expires, token }) {
      throw Error("Create verification token from next auth is not implemented");
    },
    async useVerificationToken({ identifier, token }) {
      throw Error("Use verification token from next auth is not implemented");
    },
  };
}