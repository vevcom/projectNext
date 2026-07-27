'use client'
import styles from './VisibilityAdmin.module.scss'
import Form from '@/components/Form/Form'
import Button from '@/components/UI/Button'
import { SelectNumber, SelectString } from '@/components/UI/Select'
import { useGroups } from '@/contexts/ClientData'
import { configureAction } from '@/services/configureAction'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import type {
    UpdateVisibilityAction,
    VisibilityCondition,
    VisibilityMatrix,
    VisibilityRequirement
} from '@/services/visibility/types'
import type { ExpandedGroup } from '@/services/groups/types'
import type { VisibilityRequirementGroupType } from '@/prisma-generated-pn-types'

type PropTypes = {
    visibility: VisibilityMatrix,
    visibilityId: number,
    updateVisibilityAction: UpdateVisibilityAction,
}

function findGroup(groups: ExpandedGroup[] | null, groupId: number): ExpandedGroup | undefined {
    return groups?.find(group => group.id === groupId)
}

function describeCondition(condition: VisibilityCondition, groups: ExpandedGroup[] | null): string {
    const groupName = findGroup(groups, condition.groupId)?.name ?? `gruppe #${condition.groupId}`
    return condition.type === 'ACTIVE' ? `aktiv i ${groupName}` : `var i ${groupName} i orden ${condition.order}`
}

function describeMatrix(requirements: VisibilityRequirement[], groups: ExpandedGroup[] | null): string {
    if (requirements.length === 0) return 'Synlig for alle.'
    const requirementDescriptions = requirements.map(requirement =>
        requirement.conditions.map(condition => describeCondition(condition, groups)).join(' ELLER ')
    )
    return `Krever: ${requirementDescriptions.map(description => `(${description})`).join(' OG ')}`
}

function orderOptions(group: ExpandedGroup | undefined) {
    if (!group) return []
    return Array.from(
        { length: group.order - group.firstOrder + 1 },
        (_, offset) => group.firstOrder + offset
    ).map(order => ({ value: order, label: order.toString(), key: order.toString() }))
}

export default function VisibilityAdmin({ visibility, visibilityId, updateVisibilityAction }: PropTypes) {
    const groupsResult = useGroups()
    const groups = groupsResult.status === 'success' ? groupsResult.groups : null
    const [requirements, setRequirements] = useState<VisibilityRequirement[]>(visibility.requirements)

    function addRequirement() {
        const defaultGroupId = groups?.[0]?.id
        if (defaultGroupId === undefined) return
        setRequirements(previous => [...previous, { conditions: [{ type: 'ACTIVE', groupId: defaultGroupId }] }])
    }

    function removeRequirement(requirementIndex: number) {
        setRequirements(previous => previous.filter((_, index) => index !== requirementIndex))
    }

    function addCondition(requirementIndex: number) {
        const defaultGroupId = groups?.[0]?.id
        if (defaultGroupId === undefined) return
        setRequirements(previous => previous.map((requirement, index) => (
            index === requirementIndex
                ? { conditions: [...requirement.conditions, { type: 'ACTIVE', groupId: defaultGroupId }] }
                : requirement
        )))
    }

    function removeCondition(requirementIndex: number, conditionIndex: number) {
        setRequirements(previous => previous.map((requirement, index) => (
            index === requirementIndex
                ? { conditions: requirement.conditions.filter((_, index_) => index_ !== conditionIndex) }
                : requirement
        )))
    }

    function updateCondition(requirementIndex: number, conditionIndex: number, updated: VisibilityCondition) {
        setRequirements(previous => previous.map((requirement, index) => (
            index === requirementIndex
                ? {
                    conditions: requirement.conditions.map((condition, index_) => (
                        index_ === conditionIndex ? updated : condition
                    ))
                }
                : requirement
        )))
    }

    function handleConditionGroupChange(
        requirementIndex: number,
        conditionIndex: number,
        condition: VisibilityCondition,
        groupId: number
    ) {
        const group = findGroup(groups, groupId)
        updateCondition(requirementIndex, conditionIndex, condition.type === 'ORDER'
            ? { type: 'ORDER', groupId, order: group?.order ?? condition.order }
            : { type: 'ACTIVE', groupId })
    }

    function handleConditionTypeChange(
        requirementIndex: number,
        conditionIndex: number,
        condition: VisibilityCondition,
        type: VisibilityRequirementGroupType
    ) {
        const group = findGroup(groups, condition.groupId)
        updateCondition(requirementIndex, conditionIndex, type === 'ORDER'
            ? { type: 'ORDER', groupId: condition.groupId, order: group?.order ?? 0 }
            : { type: 'ACTIVE', groupId: condition.groupId })
    }

    const saveVisibility = configureAction(updateVisibilityAction, { params: { visibilityId } })

    async function handleSave() {
        return saveVisibility({ data: { requirements } })
    }

    const groupOptions = (groups ?? []).map(group => ({ value: group.id, label: group.name, key: group.id.toString() }))

    return (
        <div className={styles.VisibilityAdmin}>
            <p className={styles.summary}>{describeMatrix(requirements, groups)}</p>
            {
                groups === null ? (
                    <p>Laster grupper...</p>
                ) : (
                    <div className={styles.editor}>
                        {
                            requirements.map((requirement, requirementIndex) => (
                                <div className={styles.requirement} key={requirementIndex}>
                                    <div className={styles.requirementHeader}>
                                        <span>Krav {requirementIndex + 1} (ett av følgende):</span>
                                        <button type="button" onClick={() => removeRequirement(requirementIndex)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                    {
                                        requirement.conditions.map((condition, conditionIndex) => (
                                            <div className={styles.condition} key={conditionIndex}>
                                                <SelectNumber
                                                    name={`req-${requirementIndex}-cond-${conditionIndex}-group`}
                                                    label="Gruppe"
                                                    value={condition.groupId}
                                                    options={groupOptions}
                                                    onChange={groupId => handleConditionGroupChange(
                                                        requirementIndex, conditionIndex, condition, groupId
                                                    )}
                                                />
                                                <SelectString
                                                    name={`req-${requirementIndex}-cond-${conditionIndex}-type`}
                                                    label="Type"
                                                    value={condition.type}
                                                    options={[
                                                        { value: 'ACTIVE', label: 'Aktivt medlem' },
                                                        { value: 'ORDER', label: 'Spesifik orden' },
                                                    ]}
                                                    onChange={type => handleConditionTypeChange(
                                                        requirementIndex,
                                                        conditionIndex,
                                                        condition,
                                                        type as VisibilityRequirementGroupType
                                                    )}
                                                />
                                                {
                                                    condition.type === 'ORDER' && (
                                                        <SelectNumber
                                                            name={`req-${requirementIndex}-cond-${conditionIndex}-order`}
                                                            label="Orden"
                                                            value={condition.order}
                                                            options={orderOptions(findGroup(groups, condition.groupId))}
                                                            onChange={order => updateCondition(
                                                                requirementIndex,
                                                                conditionIndex,
                                                                { type: 'ORDER', groupId: condition.groupId, order }
                                                            )}
                                                        />
                                                    )
                                                }
                                                <button
                                                    type="button"
                                                    onClick={() => removeCondition(requirementIndex, conditionIndex)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))
                                    }
                                    <Button color="secondary" type="button" onClick={() => addCondition(requirementIndex)}>
                                        <FontAwesomeIcon icon={faPlus} /> Legg til alternativ
                                    </Button>
                                </div>
                            ))
                        }
                        <Button color="secondary" type="button" onClick={addRequirement}>
                            <FontAwesomeIcon icon={faPlus} /> Legg til krav
                        </Button>
                        <Form submitText="Lagre" submitColor="green" refreshOnSuccess action={handleSave} />
                    </div>
                )
            }
        </div>
    )
}
