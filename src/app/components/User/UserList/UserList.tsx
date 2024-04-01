'use client'
import styles from './UserList.module.scss'
import Select from '@/UI/Select'
import { UserPagingContext } from '@/context/paging/UserPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserRow from '@/components/User/UserRow'
import useActionCall from '@/hooks/useActionCall'
import { readGroupsForPageFiteringAction } from '@/actions/users/read'
import { UserSelectionContext } from '@/context/UserSelection'
import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import type { ChangeEvent } from 'react'
import type { GroupType } from '@prisma/client'
import type { ExpandedGroup } from '@/server/groups/Types'

type GroupSelectionType = Exclude<GroupType, 'INTEREST_GROUP' | 'MANUAL_GROUP'>

type DisableGroupFilters = { [K in GroupSelectionType]?: boolean }

type PropTypes = {
    className?: string
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
            value: group.id.toString(),
            label: group.name,
            key: group.id.toString()
        })),
        {
            value: 'null',
            label: 'Alle',
            key: 'null'
        }
    ]
}

function getOrdereOptions(group: ExpandedGroup) {
    return [
        {
            value: 'null',
            label: 'Alle aktive',
            key: 'null'
        },
        ...Array.from({ length: group.order - group.firstOrder + 1 }, (_, i) => group.firstOrder + i).map(order => ({
            value: order.toString(),
            label: order.toString(),
            key: order.toString()
        })),
    ]
}

export default function UserList({ className, disableFilters = {
    name: false,
    COMMITTEE: false,
    CLASS: false,
    STUDY_PROGRAMME: false,
    OMEGA_MEMBERSHIP_GROUP: false
} }: PropTypes) {
    const userPaging = useContext(UserPagingContext)
    const userSelection = useContext(UserSelectionContext)

    const groupSelected = userPaging?.deatils.selectedGroup ? true : false

    const { data: groups } = useActionCall(readGroupsForPageFiteringAction)
    const [groupSelection, setGroupSelection] = useState<{
        [X in GroupSelectionType]: {
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

    const handleGroupSelect = (e: ChangeEvent<HTMLSelectElement>, type: GroupSelectionType) => {
        if (!groups) return
        const groupId = parseInt(e.target.value, 10)
        setGroupSelection({
            ...groupSelection,
            [type]: {
                group: groups.find(group => group.id === groupId) ?? null,
                groupOrder: 'ACTIVE'
            }
        })
    }

    const handleGroupOrderSelect = (e: ChangeEvent<HTMLSelectElement>, type: GroupSelectionType) => {
        const groupOrder = parseInt(e.target.value, 10)
        setGroupSelection({
            ...groupSelection,
            [type]: {
                ...groupSelection[type],
                groupOrder: e.target.value === 'null' ? null : groupOrder
            }
        })
    }

    return (
        <div className={`${styles.UserList} ${className}`}>
            <div className={userSelection ? `${styles.filters} ${styles.adjust}` : styles.filters}>
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
                            <Select
                                name="komite"
                                onChange={(e) => handleGroupSelect(e, 'COMMITTEE')}
                                options={getGroupOptions(groups, 'COMMITTEE')}
                            />
                            {
                                groupSelection.COMMITTEE.group && <Select
                                    name="orden"
                                    onChange={(e) => handleGroupOrderSelect(e, 'COMMITTEE')}
                                    options={getOrdereOptions(groupSelection.COMMITTEE.group)}
                                />
                            }
                        </div>
                    )
                }
                {
                    !disableFilters.CLASS && (
                        <div className={styles.group}>
                            <Select
                                name="klasse"
                                onChange={(e) => handleGroupSelect(e, 'CLASS')}
                                options={getGroupOptions(groups, 'CLASS')}
                            />
                            {
                                groupSelection.CLASS.group && <Select
                                    name="orden"
                                    onChange={(e) => handleGroupOrderSelect(e, 'CLASS')}
                                    options={getOrdereOptions(groupSelection.CLASS.group)}
                                />
                            }
                        </div>
                    )
                }
                {
                    !disableFilters.STUDY_PROGRAMME && (
                        <div className={styles.group}>
                            <Select
                                name="studie"
                                onChange={(e) => handleGroupSelect(e, 'STUDY_PROGRAMME')}
                                options={getGroupOptions(groups, 'STUDY_PROGRAMME')}
                            />
                            {
                                groupSelection.STUDY_PROGRAMME.group && <Select
                                    name="orden"
                                    onChange={(e) => handleGroupOrderSelect(e, 'STUDY_PROGRAMME')}
                                    options={getOrdereOptions(groupSelection.STUDY_PROGRAMME.group)}
                                />
                            }
                        </div>
                    )
                }
                {
                    !disableFilters.OMEGA_MEMBERSHIP_GROUP && (
                        <div className={styles.group}>
                            <Select
                                name="medlemskap"
                                onChange={(e) => handleGroupSelect(e, 'OMEGA_MEMBERSHIP_GROUP')}
                                options={getGroupOptions(groups, 'OMEGA_MEMBERSHIP_GROUP')}
                            />
                            {
                                groupSelection.OMEGA_MEMBERSHIP_GROUP.group && <Select
                                    name="orden"
                                    onChange={(e) => handleGroupOrderSelect(e, 'OMEGA_MEMBERSHIP_GROUP')}
                                    options={getOrdereOptions(groupSelection.OMEGA_MEMBERSHIP_GROUP.group)}
                                />
                            }
                        </div>
                    )
                }
            </div>
            <div className={styles.list}>
                <span className={
                    styles.head + ' '
                    + (userSelection ? styles.adjust + ' ' : ' ')
                    + (groupSelected ? styles.extraInfo : '')
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
                        { userSelection &&
                            <button
                                className={userSelection.includes(user) ? styles.selected : ''}
                                onClick={() => userSelection.toggle(user)}>
                                <FontAwesomeIcon icon={faCheck} />
                            </button>
                        }
                        <UserRow 
                            groupSelected
                            className={
                                styles.userRow + ' ' + (groupSelected ? styles.extraInfo : '')
                            } 
                            user={user} 
                        />
                    </span>
                )} />
            </div>

        </div>
    )
}
