'use client'
import styles from './UserList.module.scss'
import Select from '@/UI/Select'
import { UserPagingContext } from '@/context/paging/UserPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import UserRow from '@/components/User/UserRow'
import useActionCall from '@/hooks/useActionCall'
import { readGroupsForPageFiteringAction } from '@/actions/users/read'
import { useContext, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { GroupType } from '@prisma/client'
import type { ExpandedGroup } from '@/server/groups/Types'

type PropTypes = {
    className?: string
    disableFilters?: {
        name?: boolean,
        commitees?: boolean
        membershipGroups?: boolean
        classes?: boolean
        studyProgrammes?: boolean
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

type GroupSelectionType = Exclude<GroupType, 'INTEREST_GROUP' | 'MANUAL_GROUP'>

export default function UserList({ className, disableFilters = {
    name: false,
    commitees: false,
    membershipGroups: false,
    classes: false,
    studyProgrammes: false
} }: PropTypes) {
    const userPaging = useContext(UserPagingContext)
    const { data: groups } = useActionCall(readGroupsForPageFiteringAction)
    const [groupSelection, setGroupSelection] = useState<{
        [X in GroupSelectionType]: {
            group: ExpandedGroup | null,
            groupOrder: number | null
        }
    }>({
        COMMITTEE: {
            group: null,
            groupOrder: null
        },
        CLASS: {
            group: null,
            groupOrder: null
        },
        STUDY_PROGRAMME: {
            group: null,
            groupOrder: null
        },
        OMEGA_MEMBERSHIP_GROUP: {
            group: null,
            groupOrder: null
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
            }, [] as { groupId: number, groupOrder: number | null }[])
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
                groupOrder: null
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
            <div className={styles.filters}>
                {
                    !disableFilters.name && (
                        <div className={styles.group}>
                            <label>Navn</label>
                            <input onChange={handleChangeName} />
                        </div>
                    )
                }
                {
                    !disableFilters.commitees && (
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
                    !disableFilters.classes && (
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
                    !disableFilters.studyProgrammes && (
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
                    !disableFilters.membershipGroups && (
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
                <span className={styles.head}>
                    <h3>Navn</h3>
                    <h3>Brukernavn</h3>
                    <h3>Studie</h3>
                    <h3>Klasse</h3>
                </span>

                <EndlessScroll pagingContext={UserPagingContext} renderer={user => (
                    <UserRow key={user.id} user={user} />
                )} />
            </div>

        </div>
    )
}
