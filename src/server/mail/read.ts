import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import { userFilterSelection } from '@/server/users/ConfigVars'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { MailFlowObject, MailListTypes, ViaType } from './Types'


/**
 * This file reads how incomming mail is routed.
 * Mail flows in one direction
 * Mailalis -> Mailinglist  -> User
 *                          -> Group -> User
 *                          -> External address
 *
 * To show how the mail traverses, each node in the network above can be used
 * as a source to read the traversal in both directions.
 * Each of the traversal functions is divieded in four parts
 *  1. Fetch the data from the database
 *  2. Parse the data into arrays with only one type of object
 *       This step also adds a via object (next paragraph) if it is nessasary
 *  3. Delete unnessesary fields
 *  4. Combine duplicate nodes
 *
 *
 * Since some nodes may have different paths to itself, a via property is used.
 * For example a user can be directly connected to a mailinglist or via a group.
 * We only want the user to appear once, but we want to return
 * all the paths to the users (both via the group and direct).
 *
 *
 * The end results should be an object that can be displayed to the user to show
 * how mail is routed though a arbirtrary node in the network.
*/

/**
 * Removes duplicates from an array of objects based on their `id` property.
 * If multiple objects have the same `id`, the first object encountered is kept,
 * and the `via` property of subsequent objects with the same `id` is merged into the first object's `via` array.
 * @param objects An array of objects to remove duplicates from.
 * @returns An array of objects with duplicates removed.
 */
function removeDuplicates<T extends {
    id: number,
} & ViaType>(objects: T[]): T[] {
    const encounteredIds = new Set()
    const ret: T[] = []

    for (const obj of objects) {
        if (encounteredIds.has(obj.id)) {
            const exisingObj = ret.find(item => item.id === obj.id)
            if (exisingObj && exisingObj.via && obj.via && obj.via instanceof Array) {
                const via = obj.via[0]

                const alredyAdded = exisingObj.via.find(item => (item.type === via.type && item.id === via.id))
                if (!alredyAdded) {
                    exisingObj.via.push(via)
                }
            }
        } else {
            encounteredIds.add(obj.id)
            ret.push(obj)
        }
    }

    return ret
}

/**
 * Reads the mail flow based on a mailalias with the provided ID.
 * @param id - The ID of the mail alias.
 * @returns A Promise that resolves to a MailFlowObject.
 */
async function readAliasTraversal(id: number): Promise<MailFlowObject> {
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

    const group = results.mailingLists.map(l => l.mailingList.groups.map(g => ({
        ...g.group,
        via: [{ type: 'mailingList' as MailListTypes, id: l.mailingListId, label: l.mailingList.name }]
    }))).flat()

    const user = results.mailingLists.map(l => l.mailingList.users.map(u => ({
        ...u.user,
        via: [{ type: 'mailingList' as MailListTypes, id: l.mailingListId, label: l.mailingList.name }],
    })))
        .concat(results.mailingLists.map(l =>
            l.mailingList.groups.map(g => g.group.memberships.map(m => ({
                ...m.user,
                via: [{ type: 'group' as MailListTypes, id: g.groupId, label: g.groupId.toString() }]
            }))).flat()
        )).flat()

    const mailaddressExternal = results.mailingLists
        .map(l => l.mailingList.mailAddressExternal.map(a => ({
            ...a.mailAddressExternal,
            via: [{ type: 'mailingList' as MailListTypes, id: l.mailingListId, label: l.mailingList.name }]
        }))).flat()


    Reflect.deleteProperty(mailAlias, 'mailingLists')

    return {
        alias: [mailAlias],
        mailingList: mailingList.map(list => {
            Reflect.deleteProperty(list, 'users')
            Reflect.deleteProperty(list, 'groups')
            Reflect.deleteProperty(list, 'mailAddressExternal')
            return list
        }),
        group: removeDuplicates(group.map(g => {
            Reflect.deleteProperty(g, 'memberships')
            return g
        })),
        user: removeDuplicates(user),
        mailaddressExternal: removeDuplicates(mailaddressExternal),
    }
}

/**
 * Reads the mail flow based on a mailinglist with the provided ID.
 * @param id - The ID of the mailing list.
 * @returns A Promise that resolves to a MailFlowObject.
 */
async function readMailingListTraversal(id: number): Promise<MailFlowObject> {
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

    const mailingList = results
    const alias = mailingList.mailAliases.map(a => a.mailAlias)
    const group = mailingList.groups.map(g => g.group)
    const user = mailingList.users
        .map(u => u.user)
        .concat(
            mailingList.groups
                .map(g => g.group.memberships.map(m => ({
                    ...m.user,
                    via: [{ type: 'group' as MailListTypes, id: g.groupId, label: g.groupId }],
                })))
                .flat()
        )
    const mailaddressExternal = mailingList.mailAddressExternal.map(address => address.mailAddressExternal)

    Reflect.deleteProperty(mailingList, 'mailAliases')
    Reflect.deleteProperty(mailingList, 'groups')
    Reflect.deleteProperty(mailingList, 'users')
    Reflect.deleteProperty(mailingList, 'mailAddressExternal')

    return {
        mailingList: [mailingList],
        alias,
        group: group.map(g => {
            Reflect.deleteProperty(g, 'memberships')
            return g
        }),
        user: removeDuplicates(user),
        mailaddressExternal,
    }
}

/**
 * Reads the mail flow based on an external mail address with the provided ID.
 * @param id - The ID of the external mail address.
 * @returns A Promise that resolves to a MailFlowObject.
 */
async function readMailaddressExternalTraversal(id: number): Promise<MailFlowObject> {
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

    const mailAddressExternal = results
    const mailingList = results.mailingLists.map(list => list.mailingList)
    const aliases = results.mailingLists.map(
        list => list.mailingList.mailAliases.map(a => ({
            ...a.mailAlias,
            via: [{ type: 'mailingList' as MailListTypes, id: list.mailingListId, label: list.mailingList.name }],
        })),
    ).flat()

    Reflect.deleteProperty(mailAddressExternal, 'mailingLists')

    return {
        mailaddressExternal: [mailAddressExternal],
        mailingList: mailingList.map(l => {
            Reflect.deleteProperty(mailingList, 'mailAliases')
            return l
        }),
        alias: removeDuplicates(aliases),
        user: [],
        group: [],
    }
}

/**
 * Reads the mail flow based on a group with the provided ID.
 * @param id - The ID of the group.
 * @returns A Promise that resolves to a MailFlowObject.
 */
async function readGroupTraversal(id: number): Promise<MailFlowObject> {
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

    const group = results
    const mailingList = results.mailingLists.map(list => list.mailingList)
    const alias = mailingList
        .map(list => list.mailAliases.map(a => ({
            ...a.mailAlias,
            via: [{ type: 'mailingList' as MailListTypes, id: list.id, label: list.name }]
        })))
        .flat()

    const user = results.memberships.map(m => m.user)

    Reflect.deleteProperty(group, 'memberships')
    Reflect.deleteProperty(group, 'mailingLists')

    return {
        mailaddressExternal: [],
        mailingList: mailingList.map(l => {
            Reflect.deleteProperty(l, 'mailAliases')
            return l
        }),
        alias: removeDuplicates(alias),
        user,
        group: [group],
    }
}

/**
 * Reads the mail flow based on an user with the provided ID.
 * @param id - The ID of the user.
 * @returns A Promise that resolves to a MailFlowObject.
 */
async function readUserTraversal(id: number): Promise<MailFlowObject> {
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

    const user = results
    const mailingList = results.mailingLists
        .map(list => list.mailingList)
        .concat(
            results.memberships.map(m => m.group.mailingLists.map(l => ({
                ...l.mailingList,
                via: [{ type: 'group' as MailListTypes, id: m.groupId, label: m.groupId.toString() }]
            }))).flat()
        )

    const alias = results.mailingLists
        .map(l => l.mailingList.mailAliases.map(a => ({
            ...a.mailAlias,
            via: [{ type: 'mailingList' as MailListTypes, id: l.mailingListId, label: l.mailingList.name }]
        })))
        .concat(
            results.memberships
                .map(m => m.group.mailingLists
                    .map(l => l.mailingList.mailAliases.map(a => ({
                        ...a.mailAlias,
                        via: [{ type: 'mailingList' as MailListTypes, id: l.mailingListId, label: l.mailingList.name }]
                    }))).flat()
                )
        ).flat()

    const group = results.memberships.map(m => m.group)

    Reflect.deleteProperty(user, 'mailingLists')
    Reflect.deleteProperty(user, 'memberships')

    return {
        mailaddressExternal: [],
        mailingList: removeDuplicates(mailingList.map(l => {
            Reflect.deleteProperty(l, 'mailAlases')
            return l
        })),
        alias: removeDuplicates(alias),
        user: [user],
        group: group.map(g => {
            Reflect.deleteProperty(g, 'mailingLists')
            return g
        }),
    }
}


/**
 * Reads the mail traversal based on a source node.
 *
 * @param {Object} options - The options object.
 * @param {MailListTypes} options.filter - The filter to apply.
 * @param {number} options.id - The ID of the source object to propertate.
 * @returns {Promise<MailFlowObject>} The mail flow object.
 * @throws {ServerError} If the filter is invalid.
 */
export async function readMailTraversal({
    filter,
    id,
}: {
    filter: MailListTypes,
    id: number,
}): Promise<MailFlowObject> {
    if (filter === 'alias') {
        return await readAliasTraversal(id)
    }

    if (filter === 'mailingList') {
        return await readMailingListTraversal(id)
    }

    if (filter === 'mailaddressExternal') {
        return await readMailaddressExternalTraversal(id)
    }

    if (filter === 'group') {
        return await readGroupTraversal(id)
    }

    if (filter === 'user') {
        return await readUserTraversal(id)
    }

    throw new ServerError('BAD PARAMETERS', `The filter ${filter} is not a valid MailListTypes`)
}
