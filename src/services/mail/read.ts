import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { prisma } from '@/prisma/client'
import { UserConfig } from '@/services/users/config'
import type { MailFlowObject, MailListTypes, ViaArrayType, ViaType } from './Types'


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
} & ViaArrayType>(objects: T[]): T[] {
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
                                                        select: UserConfig.filterSelection,
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
                                        select: UserConfig.filterSelection,
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

    const group = results.mailingLists.map(list => list.mailingList.groups.map(groupItem => {
        const via: ViaType = {
            type: 'mailingList',
            id: list.mailingListId,
            label: list.mailingList.name
        }

        return {
            ...groupItem.group,
            via: [via]
        }
    })).flat()

    const user = results.mailingLists.map(list => list.mailingList.users.map(userItem => {
        const via: ViaType = {
            type: 'mailingList',
            id: list.mailingListId,
            label: list.mailingList.name
        }

        return {
            ...userItem.user,
            via: [via],
        }
    }))
        .concat(results.mailingLists.map(list =>
            list.mailingList.groups.map(groupItem => groupItem.group.memberships.map(membership => {
                const via: ViaType = {
                    type: 'group',
                    id: groupItem.groupId,
                    label: groupItem.groupId.toString()
                }

                return {
                    ...membership.user,
                    via: [via]
                }
            })).flat()
        )).flat()

    const mailaddressExternal = results.mailingLists
        .map(list => list.mailingList.mailAddressExternal.map(address => {
            const via: ViaType = {
                type: 'mailingList',
                id: list.mailingListId,
                label: list.mailingList.name
            }

            return {
                ...address.mailAddressExternal,
                via: [via]
            }
        })).flat()


    Reflect.deleteProperty(mailAlias, 'mailingLists')

    return {
        alias: [mailAlias],
        mailingList: mailingList.map(list => {
            Reflect.deleteProperty(list, 'users')
            Reflect.deleteProperty(list, 'groups')
            Reflect.deleteProperty(list, 'mailAddressExternal')
            return list
        }),
        group: removeDuplicates(group.map(groupItem => {
            Reflect.deleteProperty(groupItem, 'memberships')
            return groupItem
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
                                        select: UserConfig.filterSelection,
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
                        select: UserConfig.filterSelection,
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
    const alias = mailingList.mailAliases.map(aliasItem => aliasItem.mailAlias)
    const group = mailingList.groups.map(groupItem => groupItem.group)
    const user = mailingList.users
        .map(userItem => userItem.user)
        .concat(
            mailingList.groups
                .map(groupItem => groupItem.group.memberships.map(membership => {
                    const via: ViaType = {
                        type: 'group',
                        id: groupItem.groupId,
                        label: String(groupItem.groupId)
                    }

                    return {
                        ...membership.user,
                        via: [via],
                    }
                }))
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
        group: group.map(groupItem => {
            Reflect.deleteProperty(groupItem, 'memberships')
            return groupItem
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
        list => list.mailingList.mailAliases.map(aliasItem => {
            const via: ViaType = {
                type: 'mailingList',
                id: list.mailingListId,
                label: list.mailingList.name
            }

            return {
                ...aliasItem.mailAlias,
                via: [via],
            }
        }),
    ).flat()

    Reflect.deleteProperty(mailAddressExternal, 'mailingLists')

    return {
        mailaddressExternal: [mailAddressExternal],
        mailingList: mailingList.map(list => {
            Reflect.deleteProperty(mailingList, 'mailAliases')
            return list
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
                        select: UserConfig.filterSelection,
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
        .map(mlist => mlist.mailAliases.map(aliasItem => {
            const via: ViaType = {
                type: 'mailingList',
                id: mlist.id,
                label: mlist.name
            }

            return {
                ...aliasItem.mailAlias,
                via: [via]
            }
        }))
        .flat()

    const user = results.memberships.map(membership => membership.user)

    Reflect.deleteProperty(group, 'memberships')
    Reflect.deleteProperty(group, 'mailingLists')

    return {
        mailaddressExternal: [],
        mailingList: mailingList.map(mlist => {
            Reflect.deleteProperty(mlist, 'mailAliases')
            return mlist
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
        .map(mlist => mlist.mailingList)
        .concat(
            results.memberships.map(membership => membership.group.mailingLists.map(mlist => {
                const via: ViaType = {
                    type: 'group',
                    id: membership.groupId,
                    label: membership.groupId.toString()
                }

                return {
                    ...mlist.mailingList,
                    via: [via]
                }
            })).flat()
        )

    const alias = results.mailingLists
        .map(list => list.mailingList.mailAliases.map(aliasItem => {
            const via: ViaType = {
                type: 'mailingList',
                id: list.mailingListId,
                label: list.mailingList.name
            }

            return {
                ...aliasItem.mailAlias,
                via: [via]
            }
        }))
        .concat(
            results.memberships
                .map(membership => membership.group.mailingLists
                    .map(listItem => listItem.mailingList.mailAliases.map(aliasItem => {
                        const via: ViaType = {
                            type: 'mailingList',
                            id: listItem.mailingListId,
                            label: listItem.mailingList.name
                        }

                        return {
                            ...aliasItem.mailAlias,
                            via: [via]
                        }
                    })).flat()
                )
        ).flat()

    const group = results.memberships.map(membership => membership.group)

    Reflect.deleteProperty(user, 'mailingLists')
    Reflect.deleteProperty(user, 'memberships')

    return {
        mailaddressExternal: [],
        mailingList: removeDuplicates(mailingList.map(mlist => {
            Reflect.deleteProperty(mlist, 'mailAlases')
            return mlist
        })),
        alias: removeDuplicates(alias),
        user: [user],
        group: group.map(groupItem => {
            Reflect.deleteProperty(groupItem, 'mailingLists')
            return groupItem
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
