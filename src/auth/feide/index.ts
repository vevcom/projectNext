'use server';
import type { TokenSetParameters } from 'openid-client';
import type { FeideAccount } from '@prisma/client';
import prisma from '@/prisma';
import type { ActionReturn } from '@/actions/Types';
import errorHandler from '@/prisma/errorHandler';

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