import 'server-only'
import { MailAlias } from '@prisma/client';
import { prismaCall } from '../../prismaCall';
import prisma from '@/prisma';



export async function readAllMailAliases(): Promise<MailAlias[]> {
    return await prismaCall(() => prisma.mailAlias.findMany());
}