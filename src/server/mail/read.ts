import 'server-only'
import { MailFlowObject, MailListTypes } from './Types'
import prisma from '@/prisma'
import { prismaCall } from '../prismaCall'
import { Group, MailAddressExternal } from '@prisma/client'
import { userFilterSelection } from '../users/ConfigVars'
import { UserFiltered } from '../users/Types'
import { ServerError } from '../error'

async function readAliasFlow(id : number): Promise<MailFlowObject> {
    const results = await prismaCall(() => prisma.mailAlias.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            mailingLists: {
                include: {
                    mailingList: {
                        include: {
                            groups: {
                                include: {
                                    group: true, // Need to find users here as well
                                },
                            },
                            users: {
                                include: {
                                    user: {
                                        select: userFilterSelection,
                                    },
                                },
                            },
                            mailAddressExternal: {
                                include: {
                                    mailAddressExternal: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    }))

    const mailAlias = results
    const mailingLists = results.mailingLists.map(list => list.mailingList) ?? []
    const groups: Group[] = [];
    mailingLists.forEach(list => list.groups.forEach(group => groups.push(group.group)));
    const users: UserFiltered[] = []
    mailingLists.forEach(list => list.users.forEach(user => users.push(user.user)));
    const mailaddressExternal: MailAddressExternal[] = []
    mailingLists.forEach(list => list.mailAddressExternal.forEach(address => mailaddressExternal.push(address.mailAddressExternal)))

    return {
        alias: [mailAlias],
        mailingList: mailingLists,
        group: groups,
        user: users,
        mailaddressExternal,
    }
}

export async function readMailFlow({
    filter,
    id,
}: {
    filter: MailListTypes,
    id: number,
}): Promise<MailFlowObject> {

    if (filter == "alias") {
        return await readAliasFlow(id);
    }

    throw new ServerError("UNKNOWN ERROR", "Not implemented");
}