'use client'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { updateCommitteeAction } from '@/actions/groups/committees/update'
import React from 'react'
import type { ExpandedCommittee } from '@/services/groups/committees/Types'

type PropTypes = {
    committee: ExpandedCommittee
}

export default function UpdateCommiteeForm({ committee }: PropTypes) {
    const updateAction = updateCommitteeAction.bind(null, committee.id)

    return (
        <Form
            action={updateAction}
            submitText="Oppdater"
            navigateOnSuccess={data => `/committees/${data?.shortName}/admin`}
        >
            <TextInput name="shortName" label="kortnavn" defaultValue={committee.shortName} />
            <TextInput name="name" label="navn" defaultValue={committee.name} />
        </Form>
    )
}
