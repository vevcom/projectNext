'use server'
import prisma from "@/prisma";
import { AdapterUserCustom, selectUserFields } from "@/auth/feide/Types";
import { ActionReturn } from "../Types";
import ErrorHandler from "@/prisma/errorHandler";

export async function getAdapterUserByFeideAccount(feideId: string): Promise<ActionReturn<AdapterUserCustom | null>> {
    try {
        const account = await prisma.feideAccount.findUnique({
            where: {
                id: feideId
            },
            select: {
                user: {
                    select: selectUserFields
                }
            }
        });

        if (account === null) {
            return { success: false, error: [{message: "Account not found"}]};
        }

        return {success: true, data: account.user};
    } catch (e) {
        return ErrorHandler(e);

    }
}