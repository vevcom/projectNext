import prisma from "@/prisma";
import { FeideAccount } from "@prisma/client";
import type { ActionReturn } from "@/actions/Types";
import errorHandler from "@/prisma/errorHandler";

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