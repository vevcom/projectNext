import 'server-only'
import { MailFlowObject, MailListTypes, ViaType } from './Types'
import prisma from '@/prisma'
import { prismaCall } from '../prismaCall'
import { Group, MailAddressExternal, MailAlias } from '@prisma/client'
import { userFilterSelection } from '../users/ConfigVars'
import { UserFiltered } from '../users/Types'
import { ServerError } from '../error'

function removeDuplicates<T extends {
    id: number,
} & ViaType>(objects: T[]): T[] {
    const seenIds = new Set()
    const ret: T[] = [];

    for (const obj of objects) {
        if (seenIds.has(obj.id)) {
            const exisingObj = ret.find(item => item.id === obj.id);
            if (exisingObj && exisingObj.via && obj.via && obj.via instanceof Array) {
                const via = obj.via[0]

                const alredyAdded = exisingObj.via.find(item => (item.type == via.type && item.id == via.id))
                if (!alredyAdded) {
                    exisingObj.via.push(via)
                }
            }
        } else {
            seenIds.add(obj.id)
            ret.push(obj)
        }
    }

    return ret;
}

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

    const mailAlias = results;

    const mailingList = results.mailingLists.map(list => list.mailingList)

    const group = results.mailingLists.map(l => l.mailingList.groups.map(g => ({
        ...g.group,
        via: [{type: "mailingList" as MailListTypes, id: l.mailingListId, label: l.mailingList.name}]
    }))).flat()

    const user = results.mailingLists.map(l => l.mailingList.users.map(u => ({
            ...u.user,
            via: [{type: "mailingList" as MailListTypes, id: l.mailingListId, label: l.mailingList.name}],
        })))
        .concat(results.mailingLists.map(l =>
            l.mailingList.groups.map(g => g.group.memberships.map(m => ({
                ...m.user,
                via: [{type: "group" as MailListTypes, id: g.groupId, label: g.groupId.toString()}]
            }))).flat()
        )).flat()

    const mailaddressExternal = results.mailingLists
        .map(l => l.mailingList.mailAddressExternal.map(a => ({
            ...a.mailAddressExternal,
            via: [{type: "mailingList" as MailListTypes, id: l.mailingListId, label: l.mailingList.name}]
        }))).flat()
    
    
    delete mailAlias.mailingLists;
    
    return {
        alias: [mailAlias],
        mailingList: mailingList.map(list => {
            delete list.users;
            delete list.groups;
            delete list.mailAddressExternal;
            return list
        }),
        group: removeDuplicates(group.map(g => {
            delete g.memberships;
            return g
        })),
        user: removeDuplicates(user),
        mailaddressExternal: removeDuplicates(mailaddressExternal),
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
            .map(g => g.group.memberships.map(m => ({
                ...m.user,
                via: [{type: "group" as MailListTypes, id: g.groupId, label: g.groupId}],
            })))
            .flat()
        );
    const mailaddressExternal = mailingList.mailAddressExternal.map(address => address.mailAddressExternal);

    return {
        mailingList: [mailingList],
        alias,
        group,
        user: removeDuplicates(user),
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
    const aliases = results.mailingLists.map(
        list => list.mailingList.mailAliases.map(a => ({
            ...a.mailAlias,
            via: [{type: "mailingList" as MailListTypes, id: list.mailingListId, label: list.mailingList.name}],
        })),
    ).flat()

    return {
        mailaddressExternal: [mailAddressExternal],
        mailingList,
        alias: removeDuplicates(aliases),
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
        .map(list => list.mailAliases.map(alias => ({
            ...alias.mailAlias,
            via: [{type: "mailingList" as MailListTypes, id: list.id, label: list.name}]
        })))
        .flat();
    
    const user = results.memberships.map(m => m.user)

    return {
        mailaddressExternal: [],
        mailingList,
        alias: removeDuplicates(alias),
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
            results.memberships.map(m => m.group.mailingLists.map(l => ({
                ...l.mailingList,
                via: [{type: "group" as MailListTypes, id: m.groupId, label: m.groupId.toString()}]
            }))).flat()
        )

    const alias = results.mailingLists
        .map(l => l.mailingList.mailAliases.map(a => ({
            ...a.mailAlias,
            via: [{type: "mailingList" as MailListTypes, id: l.mailingListId, label: l.mailingList.name}]
        })))
        .concat(
            results.memberships
                .map(m => m.group.mailingLists
                    .map(l => l.mailingList.mailAliases.map(a => ({
                        ...a.mailAlias,
                        via: [{type: "mailingList" as MailListTypes, id: l.mailingListId, label: l.mailingList.name}]
                    }))).flat()
                )
        ).flat()
    
    const group = results.memberships.map(m => m.group)

    return {
        mailaddressExternal: [],
        mailingList: removeDuplicates(mailingList),
        alias: removeDuplicates(alias),
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