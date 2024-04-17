import 'server-only'
import { MailFlowObject, MailListTypes } from './Types'
import prisma from '@/prisma'
import { prismaCall } from '../prismaCall'
import { Group, MailAddressExternal, MailAlias } from '@prisma/client'
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

async function readMailingListFlow(id: number): Promise<MailFlowObject> {
    const results = await prismaCall(() => prisma.mailingList.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            mailAliases: {
                include: {
                    mailAlias: true,
                },
            },
            groups: {
                include: {
                    group: true, // TODO: Add users in group
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
                },
            },
        }
    }))

    const mailingList = results;
    const alias = mailingList.mailAliases.map(alias => alias.mailAlias)
    const group = mailingList.groups.map(group => group.group);
    const user = mailingList.users.map(user => user.user);
    const mailaddressExternal = mailingList.mailAddressExternal.map(address => address.mailAddressExternal);

    return {
        mailingList: [mailingList],
        alias,
        group,
        user,
        mailaddressExternal,
    }
}

async function readMailaddressExternalFlow(id: number): Promise<MailFlowObject> {
    const results = await prismaCall(() => prisma.mailAddressExternal.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            mailingLists: {
                include: {
                    mailingList: {
                        include: {
                            mailAliases: {
                                include: {
                                    mailAlias: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    }))

    const mailAddressExternal = results;
    const mailingList = results.mailingLists.map(list => list.mailingList);
    const aliases: MailAlias[] = [];
    mailingList.forEach(list => list.mailAliases.forEach(alias => aliases.push(alias.mailAlias)))

    return {
        mailaddressExternal: [mailAddressExternal],
        mailingList,
        alias: aliases,
        user: [],
        group: [],
    }
}

export async function readMailFlow({
    filter,
    id,
}: {
    filter: MailListTypes,
    id: number,
}): Promise<MailFlowObject> {

    if (filter === "alias") {
        return await readAliasFlow(id);
    }

    if (filter === "mailingList") {
        return await readMailingListFlow(id);
    }

    if (filter === "mailaddressExternal") {
        return await readMailaddressExternalFlow(id);
    }

    throw new ServerError("UNKNOWN ERROR", "Not implemented");
}