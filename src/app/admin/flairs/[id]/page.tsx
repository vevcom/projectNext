import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { destroyFlairAction, readFlairAction, updateFlairAction } from '@/services/flairs/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { configureAction } from '@/services/configureAction'
import Flair from '@/components/Flair/Flair'
import { ServerSession } from '@/auth/session/ServerSession'
import ColorInput from '@/components/UI/ColorInput'
import PageWrapper from '@/components/PageWrapper/PageWrapper'

type PropTypes = {
    params: Promise<{
        id: string
    }>
}

export default async function FlairUpdatePage({ params }: PropTypes) {
    const flair = unwrapActionReturn(
        await readFlairAction({ params: { flairId: Number((await params).id) } })
    )
    const session = await ServerSession.fromNextAuth()

    return (
        <PageWrapper title={`Rediger flair: ${flair.name}`}>
            <Flair session={session} flair={flair} width={200} asClient={false} />
            <Form
                title="Oppdater flair"
                submitText="Oppdater flair"
                action={configureAction(updateFlairAction, { params: { flairId: flair.id } })}
                refreshOnSuccess
            >
                <TextInput defaultValue={flair.name} label="Navn" name="name" />
                <ColorInput defaultValueRGB={{
                    red: flair.colorR,
                    green: flair.colorG,
                    blue: flair.colorB
                }} label="Farge" name="color" />
            </Form>
            <Form
                title="Slett flair"
                submitText="Slett flair"
                action={configureAction(destroyFlairAction, { params: { flairId: flair.id } })}
                navigateOnSuccess="/admin/flairs"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: `
                        Er du sikker på at du vil slette flairsen "${flair.name}"?
                        Dette kan ikke angres, og alle brukere som har denne flairsen vil miste den.
                    `
                }}
            />
        </PageWrapper>
    )
}
