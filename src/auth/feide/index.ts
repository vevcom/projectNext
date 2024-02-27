'use server';
import type { TokenSetParameters } from 'openid-client';
import type { FeideAccount } from '@prisma/client';
import prisma from '@/prisma';
import type { ActionReturn } from '@/actions/Types';
import errorHandler from '@/prisma/errorHandler';
import { AdapterUserCustom, adapterUserCutomFields } from "@/auth/feide/Types";

export async function updateFeideTokens(accountId: string, token: TokenSetParameters): Promise<ActionReturn<boolean>> {

    try {
        const expiresAt = token.expires_at ? new Date(token.expires_at * 1000) : new Date();
    
        await prisma.feideAccount.update({
            where: {
                id: accountId
            },
            data: {
                accessToken: token.access_token,
                expiresAt,
                issuedAt: new Date(),
            }
        });
    
        return {success: true, data: true};
    } catch (error) {
        return errorHandler(error);
    }
}

export async function createFeideAccount({id, accessToken, expiresAt, issuedAt, userId}: FeideAccount): Promise<ActionReturn<FeideAccount>> {
    try {
        const ret = await prisma.feideAccount.create({
            data: {
                id,
                accessToken,
                expiresAt,
                issuedAt,
                user: {
                    connect: {
                        id: userId,
                    },
                }
            }
        });

        return { success: true, data: ret };
    } catch (e) {
        return errorHandler(e);
    }
}

export async function getAdapterUserByFeideAccount(feideId: string): Promise<ActionReturn<AdapterUserCustom | null>> {
    try {
        const account = await prisma.feideAccount.findUnique({
            where: {
                id: feideId
            },
            select: {
                user: {
                    select: adapterUserCutomFields
                }
            }
        });

        if (account === null) {
            return { success: false, error: [{message: "Account not found"}]};
        }

        return {success: true, data: account.user};
    } catch (e) {
        return errorHandler(e);

    }
}