'use client'

import { deleteReleaseGroupAction, updateReleaseGroupAction } from '@/actions/cabin'
import Form from '@/app/_components/Form/Form'
import DateInput from '@/app/_components/UI/DateInput'
import type { ReleaseGroup } from '@prisma/client'

export default function UpdateReleaseGroupForm({
    releaseGroup
}: {
    releaseGroup: ReleaseGroup
}) {
    return <>
        <Form
            action={updateReleaseGroupAction.bind(null, {})}
            submitText="Oppdater"
        >
            <input type="hidden" name="id" value={releaseGroup.id} />
            <DateInput
                name="releaseTime"
                label="Slipptid"
                includeTime={true}
                defaultValue={releaseGroup.releaseTime ? releaseGroup.releaseTime : undefined} />
        </Form>
        <Form
            action={deleteReleaseGroupAction.bind(null, { id: releaseGroup.id })}
            submitText="Slett Slippgruppe"
            submitColor="red"
            confirmation={{
                confirm: true,
                text: 'Er du sikker på at du vil slette denne slipgruppen'
            }}
        >
            <></>
        </Form>
    </>
}
