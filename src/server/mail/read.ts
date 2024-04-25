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
                                    group: {
                                        include: {
                                            memberships: {
                                                // TODO: only find valid memberships
                                                include: {
                                                    user: {
                                                        select: userFilterSelection,
                                                    }
                                                }
                                            }
                                        }
                                    }
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
    const mailingList = results.mailingLists.map(list => list.mailingList)
    const group = results.mailingLists.map(l => l.mailingList.groups.map(g => g.group)).flat();

    const user = results.mailingLists.map(l => l.mailingList.users.map(u => u.user))
        .concat(results.mailingLists.map(l =>
            l.mailingList.groups.map(g => g.group.memberships.map(m => m.user)).flat()
        )).flat()

    const mailaddressExternal = results.mailingLists
        .map(l => l.mailingList.mailAddressExternal.map(a => a.mailAddressExternal)).flat()
    
    return {
        alias: [mailAlias],
        mailingList,
        group,
        user,
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
                    group: {
                        include: {
                            memberships: {
                                /*where: {
                                    active: true,
                                },*/
                                include: {
                                    user: {
                                        select: userFilterSelection,
                                    }
                                }
                            }
                        }
                    }, // TODO: Add users in group
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
    const user = mailingList.users
        .map(user => user.user)
        .concat(
            mailingList.groups
            .map(g => g.group.memberships.map(m => m.user))
            .reduce((acc, users) => acc.concat(users), [])
        );
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

async function readGroupFlow(id: number): Promise<MailFlowObject> {
    const results = await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            memberships: {
                include: {
                    user: {
                        select: userFilterSelection,
                    }
                }
            },
            mailingLists: {
                include: {
                    mailingList: {
                        include: {
                            mailAliases: {
                                include: {
                                    mailAlias: true,
                                },
                            }
                        },
                    },
                },
            },
        }
    }))

    const group = results;
    const mailingList = results.mailingLists.map(list => list.mailingList);
    const alias = mailingList
        .map(list => list.mailAliases.map(alias => alias.mailAlias))
        .flat();
    
    const user = results.memberships.map(m => m.user)

    return {
        mailaddressExternal: [],
        mailingList,
        alias,
        user,
        group: [group],
    }
}

async function readUserFlow(id: number): Promise<MailFlowObject> {
    const results = await prismaCall(() => prisma.user.findUniqueOrThrow({
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
            },
            memberships: {
                include: {
                    group: {
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
                    }
                }
            }
        }
    }))

    const user = results;
    const mailingList = results.mailingLists
        .map(list => list.mailingList)
        .concat(
            results.memberships.map(m => m.group.mailingLists.map(l => l.mailingList))
                .flat()
        )

    const alias = results.mailingLists
        .map(l => l.mailingList.mailAliases.map(a => a.mailAlias))
        .concat(
            results.memberships
                .map(m => m.group.mailingLists
                    .map(l => l.mailingList.mailAliases.map(a => a.mailAlias)).flat()
                )
        ).flat()
    
    const group = results.memberships.map(m => m.group)

    return {
        mailaddressExternal: [],
        mailingList,
        alias,
        user: [user],
        group,
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

    if (filter === "group") {
        return await readGroupFlow(id);
    }

    if (filter === "user") {
        return await readUserFlow(id);
    }

    throw new ServerError("UNKNOWN ERROR", "Not implemented");
}