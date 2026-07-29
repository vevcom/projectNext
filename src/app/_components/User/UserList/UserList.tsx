'use client'
import styles from './UserList.module.scss'
import Dropdown from '@/components/UI/Dropdown'
import SearchableDropdown from '@/components/UI/SearchableDropdown'
import TextInput from '@/components/UI/TextInput'
import { UserPagingContext } from '@/contexts/paging/UserPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserRow from '@/components/User/UserList/UserRow'
import useActionCall from '@/hooks/useActionCall'
import { UsersSelectionContext } from '@/contexts/UsersSelection'
import { UserSelectionContext } from '@/contexts/UserSelection'
import { readGroupsForPageFilteringAction } from '@/services/users/actions'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import type { UserPagingReturn } from '@/services/users/types'
import type { ChangeEvent, MouseEvent, ReactNode } from 'react'
import type { GroupType } from '@/prisma-generated-pn-types'
import type { ExpandedGroup } from '@/services/groups/types'

type GroupSelectionType = Exclude<GroupType, 'INTEREST_GROUP' | 'MANUAL_GROUP'>

type DisableGroupFilters = { [K in GroupSelectionType]?: boolean }

type SortField = 'name' | 'username'

type PropTypes = {
    className?: string
    displayForUser?: (user: UserPagingReturn) => ReactNode
    disableFilters?: DisableGroupFilters & {
        name?: boolean,
    },
    linksToUser?: boolean
}

function getGroupType(groups: ExpandedGroup[] | null, type: GroupType) {
    return groups ? groups.filter(group => group.groupType === type) : []
}

function getGroupOptions(
    groups: ExpandedGroup[] | null,
    type: GroupType
): { value: number | 'NULL', label: string, key: string }[] {
    return [
        ...getGroupType(groups, type).map(group => ({
            value: group.id,
            label: group.name,
            key: group.id.toString()
        })),
        {
            value: 'NULL',
            label: 'Alle',
            key: 'NULL'
        },
    ]
}

function getOrdereOptions(group: ExpandedGroup): { value: number | 'NULL', label: string, key: string }[] {
    return [
        ...Array.from({ length: group.order - group.firstOrder + 1 }, (_, i) => group.firstOrder + i).map(order => ({
            value: order,
            label: order.toString(),
            key: order.toString()
        })),
        {
            value: 'NULL',
            label: 'Alle aktive',
            key: 'NULL'
        },
    ]
}

/**
 * Display users in UserPagingContext with filters for groups and a search bar.
 * @param className - The class name of the component
 * @param displayForUser - A function that returns a ReactNode for each user. It is displayed
 * to the left of the user's name, username, study, and class.
 * @param disableFilters - An object that specifies which filters to disable. The keys are the
 * names of the filters and the values are booleans. If a key is not present, the filter is enabled.
 * @returns - A component that displays a list of users with filters for groups and a search bar.
 */
export default function UserList({
    className,
    displayForUser,
    disableFilters = {
        name: false,
        COMMITTEE: false,
        CLASS: false,
        STUDY_PROGRAMME: false,
        OMEGA_MEMBERSHIP_GROUP: false
    },
    linksToUser,
}: PropTypes) {
    const userPaging = useContext(UserPagingContext)
    const usersSelection = useContext(UsersSelectionContext)
    const userSelection = useContext(UserSelectionContext)
    const router = useRouter()

    const groupSelected = !!userPaging?.details.selectedGroup

    const { data: groups } = useActionCall(readGroupsForPageFilteringAction)
    const [groupSelection, setGroupSelection] = useState<{
        [T in GroupSelectionType]: {
            group: ExpandedGroup | null,
            groupOrder: number | 'ACTIVE'
        }
    }>({
        COMMITTEE: {
            group: null,
            groupOrder: 'ACTIVE'
        },
        CLASS: {
            group: null,
            groupOrder: 'ACTIVE'
        },
        STUDY_PROGRAMME: {
            group: null,
            groupOrder: 'ACTIVE'
        },
        OMEGA_MEMBERSHIP_GROUP: {
            group: null,
            groupOrder: 'ACTIVE'
        }
    })

    useEffect(() => {
        userPaging?.setDetails({
            ...userPaging.details,
            groups: Object.values(groupSelection).reduce((acc, { group, groupOrder }) => {
                if (group) {
                    acc.push({
                        groupId: group.id,
                        groupOrder
                    })
                }
                return acc
            }, [] as { groupId: number, groupOrder: number | 'ACTIVE' }[])
        })
    }, [groupSelection])

    if (!userPaging) throw new Error('UserPagingContext not found')

    const currentSort = userPaging.details.sort

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        userPaging.setDetails({ ...userPaging.details, partOfName: e.target.value })
    }

    const handleSort = (field: SortField) => {
        const direction = currentSort?.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc'
        userPaging.setDetails({ ...userPaging.details, sort: { field, direction } })
    }

    const sortIcon = (field: SortField) => {
        if (currentSort?.field !== field) return <FontAwesomeIcon icon={faSort} className={styles.sortIcon} />
        return (
            <FontAwesomeIcon
                icon={currentSort.direction === 'asc' ? faSortUp : faSortDown}
                className={styles.sortIcon}
            />
        )
    }

    const handleGroupSelect = (groupId: number | 'NULL', type: GroupSelectionType) => {
        if (!groups) return
        setGroupSelection({
            ...groupSelection,
            [type]: {
                ...groupSelection[type],
                group: groups.find(group => group.id === groupId) ?? null,
            }
        })
    }

    const handleGroupOrderSelect = (order: number | 'NULL', type: GroupSelectionType) => {
        const groupOrder = order === 'NULL' ? null : order
        setGroupSelection({
            ...groupSelection,
            [type]: {
                ...groupSelection[type],
                groupOrder,
            }
        })
    }

    const stopSelectionClickPropagation = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
    }

    return (
        <div className={`${styles.UserList} ${className}`}>
            <div className={styles.filters}>
                {
                    !disableFilters.name && (
                        <TextInput
                            name="partOfName"
                            label="Navn"
                            onChange={handleChangeName}
                            className={styles.nameFilter}
                        />
                    )
                }
                {
                    !disableFilters.COMMITTEE && (
                        <div className={styles.group}>
                            <SearchableDropdown
                                name="komite"
                                label="Komité"
                                onChange={groupId => handleGroupSelect(groupId, 'COMMITTEE')}
                                options={getGroupOptions(groups, 'COMMITTEE')}
                            />
                            {
                                groupSelection.COMMITTEE.group && <Dropdown
                                    name="orden"
                                    label="Orden"
                                    onChange={order => handleGroupOrderSelect(order, 'COMMITTEE')}
                                    options={getOrdereOptions(groupSelection.COMMITTEE.group)}
                                />
                            }
                        </div>
                    )
                }
                {
                    !disableFilters.CLASS && (
                        <div className={styles.group}>
                            <Dropdown
                                name="klasse"
                                label="Klasse"
                                onChange={groupId => handleGroupSelect(groupId, 'CLASS')}
                                options={getGroupOptions(groups, 'CLASS')}
                            />
                            {
                                groupSelection.CLASS.group && <Dropdown
                                    name="orden"
                                    label="Orden"
                                    onChange={order => handleGroupOrderSelect(order, 'CLASS')}
                                    options={getOrdereOptions(groupSelection.CLASS.group)}
                                />
                            }
                        </div>
                    )
                }
                {
                    !disableFilters.STUDY_PROGRAMME && (
                        <div className={styles.group}>
                            <Dropdown
                                name="studie"
                                label="Studieprogram"
                                onChange={groupId => handleGroupSelect(groupId, 'STUDY_PROGRAMME')}
                                options={getGroupOptions(groups, 'STUDY_PROGRAMME')}
                            />
                            {
                                groupSelection.STUDY_PROGRAMME.group && <Dropdown
                                    name="orden"
                                    label="Orden"
                                    onChange={order => handleGroupOrderSelect(order, 'STUDY_PROGRAMME')}
                                    options={getOrdereOptions(groupSelection.STUDY_PROGRAMME.group)}
                                />
                            }
                        </div>
                    )
                }
                {
                    !disableFilters.OMEGA_MEMBERSHIP_GROUP && (
                        <div className={styles.group}>
                            <Dropdown
                                name="medlemskap"
                                label="Medlemskap"
                                onChange={groupId => handleGroupSelect(groupId, 'OMEGA_MEMBERSHIP_GROUP')}
                                options={getGroupOptions(groups, 'OMEGA_MEMBERSHIP_GROUP')}
                            />
                            {
                                groupSelection.OMEGA_MEMBERSHIP_GROUP.group && <Dropdown
                                    name="orden"
                                    label="Orden"
                                    onChange={order => handleGroupOrderSelect(order, 'OMEGA_MEMBERSHIP_GROUP')}
                                    options={getOrdereOptions(groupSelection.OMEGA_MEMBERSHIP_GROUP.group)}
                                />
                            }
                        </div>
                    )
                }
            </div>
            <div className={styles.listWrapper}>
                <table className={styles.list}>
                    <thead>
                        <tr>
                            {(usersSelection || userSelection) && <th></th>}
                            {displayForUser && <th></th>}
                            <th className={styles.sortable} onClick={() => handleSort('name')}>
                                Navn {sortIcon('name')}
                            </th>
                            <th className={styles.sortable} onClick={() => handleSort('username')}>
                                Brukernavn {sortIcon('username')}
                            </th>
                            <th>Studie</th>
                            <th>Klasse</th>
                            {
                                groupSelected && (
                                    <>
                                        <th>Tittel</th>
                                        <th>Admin</th>
                                    </>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <EndlessScroll pagingContext={UserPagingContext} renderer={user => (
                            <tr
                                key={user.id}
                                className={linksToUser ? styles.clickable : ''}
                                onClick={() => {
                                    if (!linksToUser) return
                                    router.push(`/users/${user.username}`)
                                }}
                            >
                                { usersSelection &&
                                    <td>
                                        <button
                                            className={usersSelection.includes(user) ? styles.selected : ''}
                                            onClick={(event) => {
                                                stopSelectionClickPropagation(event)
                                                usersSelection.toggle(user)
                                            }}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    </td>
                                }
                                { userSelection &&
                                    <td>
                                        <button
                                            className={userSelection.user?.id === user.id ? styles.selected : ''}
                                            onClick={(event) => {
                                                stopSelectionClickPropagation(event)
                                                userSelection.setUser(user)
                                            }}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    </td>
                                }
                                {
                                    displayForUser && <td>{displayForUser(user)}</td>
                                }
                                <UserRow groupSelected={groupSelected} user={user} />
                            </tr>
                        )} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}
