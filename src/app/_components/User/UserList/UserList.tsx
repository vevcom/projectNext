'use client'
import styles from './UserList.module.scss'
import { SelectNumberPossibleNULL } from '@/UI/Select'
import { UserPagingContext } from '@/contexts/paging/UserPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserRow from '@/components/User/UserList/UserRow'
import useActionCall from '@/hooks/useActionCall'
import { readGroupsForPageFilteringAction } from '@/actions/users/read'
import { UsersSelectionContext } from '@/contexts/UsersSelection'
import { UserSelectionContext } from '@/contexts/UserSelection'
import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import type { UserPagingReturn } from '@/services/users/Types'
import type { ChangeEvent, ReactNode } from 'react'
import type { GroupType } from '@prisma/client'
import type { ExpandedGroup } from '@/services/groups/Types'

type GroupSelectionType = Exclude<GroupType, 'INTEREST_GROUP' | 'MANUAL_GROUP'>

type DisableGroupFilters = { [K in GroupSelectionType]?: boolean }

type PropTypes = {
    className?: string
    displayForUser?: (user: UserPagingReturn) => ReactNode
    disableFilters?: DisableGroupFilters & {
        name?: boolean,
    }
}

function getGroupType(groups: ExpandedGroup[] | null, type: GroupType) {
    return groups ? groups.filter(group => group.groupType === type) : []
}

function getGroupOptions(groups: ExpandedGroup[] | null, type: GroupType) {
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
        } as const,
    ]
}

function getOrdereOptions(group: ExpandedGroup) {
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
        }as const,
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
    }
}: PropTypes) {
    const userPaging = useContext(UserPagingContext)
    const usersSelection = useContext(UsersSelectionContext)
    const userSelection = useContext(UserSelectionContext)

    const groupSelected = !!userPaging?.deatils.selectedGroup

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
            ...userPaging.deatils,
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


    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        userPaging.setDetails({ ...userPaging.deatils, partOfName: e.target.value })
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

    return (
        <div className={`${styles.UserList} ${className}`}>
            <div className={usersSelection || userSelection ? `${styles.filters} ${styles.adjust}` : styles.filters}>
                {
                    !disableFilters.name && (
                        <div className={styles.group}>
                            <label>Navn</label>
                            <input onChange={handleChangeName} />
                        </div>
                    )
                }
                {
                    !disableFilters.COMMITTEE && (
                        <div className={styles.group}>
                            <SelectNumberPossibleNULL
                                name="komite"
                                onChange={groupId => handleGroupSelect(groupId, 'COMMITTEE')}
                                options={getGroupOptions(groups, 'COMMITTEE')}
                            />
                            {
                                groupSelection.COMMITTEE.group && <SelectNumberPossibleNULL
                                    name="orden"
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
                            <SelectNumberPossibleNULL
                                name="klasse"
                                onChange={groupId => handleGroupSelect(groupId, 'CLASS')}
                                options={getGroupOptions(groups, 'CLASS')}
                            />
                            {
                                groupSelection.CLASS.group && <SelectNumberPossibleNULL
                                    name="orden"
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
                            <SelectNumberPossibleNULL
                                name="studie"
                                onChange={groupId => handleGroupSelect(groupId, 'STUDY_PROGRAMME')}
                                options={getGroupOptions(groups, 'STUDY_PROGRAMME')}
                            />
                            {
                                groupSelection.STUDY_PROGRAMME.group && <SelectNumberPossibleNULL
                                    name="orden"
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
                            <SelectNumberPossibleNULL
                                name="medlemskap"
                                onChange={groupId => handleGroupSelect(groupId, 'OMEGA_MEMBERSHIP_GROUP')}
                                options={getGroupOptions(groups, 'OMEGA_MEMBERSHIP_GROUP')}
                            />
                            {
                                groupSelection.OMEGA_MEMBERSHIP_GROUP.group && <SelectNumberPossibleNULL
                                    name="orden"
                                    onChange={order => handleGroupOrderSelect(order, 'OMEGA_MEMBERSHIP_GROUP')}
                                    options={getOrdereOptions(groupSelection.OMEGA_MEMBERSHIP_GROUP.group)}
                                />
                            }
                        </div>
                    )
                }
            </div>
            <div className={styles.list}>
                <span className={
                    `${styles.head} ${
                        usersSelection || userSelection || displayForUser ? `${styles.adjust} ` : ' '
                    }${groupSelected ? styles.extraInfo : ''}`
                }>
                    <h3>Navn</h3>
                    <h3>Brukernavn</h3>
                    <h3>Studie</h3>
                    <h3>Klasse</h3>
                    {
                        groupSelected && (
                            <>
                                <h3>Tittel</h3>
                                <h3>Admin</h3>
                            </>
                        )
                    }
                </span>

                <EndlessScroll pagingContext={UserPagingContext} renderer={user => (
                    <span className={styles.row} key={user.id}>
                        { usersSelection &&
                            <button
                                className={usersSelection.includes(user) ? styles.selected : ''}
                                onClick={() => usersSelection.toggle(user)}>
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        }
                        { userSelection &&
                            <button
                                className={userSelection.user?.id === user.id ? styles.selected : ''}
                                onClick={() => userSelection.setUser(user)}>
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        }
                        {
                            displayForUser && displayForUser(user)
                        }
                        <UserRow
                            groupSelected={groupSelected}
                            className={
                                `${styles.userRow} ${groupSelected ? styles.extraInfo : ''}`
                            }
                            user={user}
                        />
                    </span>
                )} />
            </div>

        </div>
    )
}
