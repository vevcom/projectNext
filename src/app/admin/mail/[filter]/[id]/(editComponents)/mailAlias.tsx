'use client'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { SelectNumber } from '@/components/UI/Select'
import { createAliasMailingListRelationAction } from '@/services/mail/actions'
import { updateMailAliasAction, destroyMailAliasAction } from '@/services/mail/alias/actions'
import { useSession } from '@/auth/session/useSession'
import { useRouter } from 'next/navigation'
import type { MailFlowObject } from '@/services/mail/types'
import type { MailingList } from '@/prisma-generated-pn-types'

export default function EditMailAlias({
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {
    const { push } = useRouter()

    const focusedAlias = data.alias[0]
    if (!focusedAlias) {
        throw Error('Could not find alias')
    }

    const session = useSession()
    const permissions = !session.loading ? session.session.permissions : []

    return <>
        <h2>{focusedAlias.address}</h2>
        { /** TODO: Call authorizer */ }
        { permissions.includes('MAILALIAS_UPDATE') && <div>
            <Form
                title="Alias"
                submitText="Oppdater"
                action={updateMailAliasAction}
            >
                <input type="hidden" name="id" value={focusedAlias.id} />
                <TextInput name="address" label="E-post" defaultValue={focusedAlias.address} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedAlias.description} />
            </Form>
        </div>}
        { permissions.includes('MAILALIAS_DESTROY') && <div>
            <Form
                action={destroyMailAliasAction.bind(null, focusedAlias.id)}
                successCallback={() => push('/admin/mail')}
                submitText="Slett"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Sikker på at du vil slette dette mailaliaset? Dette kan ikke angres.',
                }}
            />
        </div> }
        { permissions.includes('MAILINGLIST_ALIAS_CREATE') && <div>
            <Form
                title="Legg til mailliste"
                submitText="Legg til"
                action={createAliasMailingListRelationAction}
            >
                <input type="hidden" name="mailAliasId" value={focusedAlias.id} />
                <SelectNumber
                    options={mailingLists.map(list => ({ value: list.id, label: list.name }))}
                    name="mailingListId"
                    label="Mailliste"
                />
            </Form>
        </div>}
    </>
}
