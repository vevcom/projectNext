import 'server-only'
import { prismaCall } from '@/server/prismaCall';
import { MailAddressExternal } from '@prisma/client';
import prisma from '@/prisma';


export async function readAllMailAddressExternal(): Promise<MailAddressExternal[]> {
    return await prismaCall(() => prisma.mailAddressExternal.findMany())
}