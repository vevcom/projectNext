import { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters";
import type { FeideAccount, PrismaClient } from "@prisma/client";
import { adapterUserCutomFields, AdapterUserCustom } from "./Types";
import { getAdapterUserByFeideAccount } from "@/actions/feideaccount/read";
import { createFeideAccount } from "@/actions/feideaccount/create";

function addALotOfFrustrationWithNextAuth(user: AdapterUserCustom): AdapterUser {
    return {
        ...user,
        emailVerified: null,
        id: String(user.id)
    }
}

function HS_MAA_GAA(user: AdapterUserCustom | null | undefined): AdapterUser | null {
    if (user === null || user === undefined) {
        return null;
    }
    return addALotOfFrustrationWithNextAuth(user);
}

export default function PrismaAdapter(prisma: PrismaClient): Adapter {
    return {

        async createUser(user: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
            // REFACTOR
            const ret = await prisma.user.create({
                data: {
                    username: user.username,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                },
                select: adapterUserCutomFields
            });

            return addALotOfFrustrationWithNextAuth(ret);
        },

        async getUser(id: string | number): Promise<AdapterUser | null> {
            // REFACTOR
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(id)
                },
                select: adapterUserCutomFields
            });

            return HS_MAA_GAA(user);
        },

        async getUserByEmail(email: string): Promise<AdapterUser | null> {
            // REFACTOR
            console.log("Next auth is trying to get a user by email???")
            const user = await prisma.user.findUnique({
                where: {
                    email
                },
                select: adapterUserCutomFields
            });
            return HS_MAA_GAA(user);
        },

        async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }): Promise<AdapterUser | null> {
            if (provider !== "feide") {
                console.log(provider);
                throw new Error("Unsupported provider");
            }

            const user = await getAdapterUserByFeideAccount(providerAccountId);

            if (!user.success) {
                return null;
            }

            return HS_MAA_GAA(user.data);
        },

        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {

            // REFACTOR
            console.warn("Next auth is trying to update a user???");

            console.log(user);

            const ret = await prisma.user.findUnique({
                where: {
                    id: Number(user.id)
                },
                select: adapterUserCutomFields
            });

            return HS_MAA_GAA(ret) as AdapterUser;
        },
        async linkAccount(account : AdapterAccount) : Promise<void> {
            const feideAccountFields = ['id', 'accessToken', 'expiresAt', 'issuedAt', 'userId'] as const;

            const feideAccount = feideAccountFields.reduce((prev, field) => ({
                ...prev,
                [field]: account[field]
            }), {} as FeideAccount);

            await createFeideAccount(feideAccount);
        },
        async deleteUser(userId) {
            throw Error("Delete user from next uath is not implemented");
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