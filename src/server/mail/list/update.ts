import 'server-only'
import { MailingList } from "@prisma/client";
import { UpdateMailingListTypes, updateMailingListValidation } from "./validation";
import { prismaCall } from "@/server/prismaCall";
import prisma from "@/prisma";



export async function updateMailingList(data: UpdateMailingListTypes['Detailed']):
Promise<MailingList> {

    const parse = updateMailingListValidation.detailedValidate(data)

    return await prismaCall(() => prisma.mailingList.update({
        where: {
            id: parse.id,
        },
        data: {
            name: parse.name,
            description: parse.description,
        },
    }))
}