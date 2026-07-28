import FlairTable from './FlairTable'
import { createFlairAction, readAllFlairsAction } from '@/services/flairs/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import Form from '@/components/Form/Form'
import ColorInput from '@/components/UI/ColorInput'
import TextInput from '@/components/UI/TextInput'
import Flair from '@/components/Flair/Flair'
import { ServerSession } from '@/auth/session/ServerSession'
import type { FlairRow } from './FlairTable'


export default async function FlairUpdatePage() {
    const flairs = unwrapActionReturn(await readAllFlairsAction()).sort((a, b) => a.rank - b.rank)
    const session = await ServerSession.fromNextAuth()

    const rows: FlairRow[] = flairs.map(flair => ({
        id: flair.id,
        image: <Flair asClient={false} session={session} flair={flair} width={100} />,
        name: flair.name,
        colorStyle: { backgroundColor: `rgb(${flair.colorR}, ${flair.colorG}, ${flair.colorB})` },
        editHref: `/admin/flairs/${flair.id}`,
    }))

    return (
        <PageWrapper title="Adminitrer Flairs" headerItem={
            <AddHeaderItemPopUp popUpKey="CreateFlair">
                <Form
                    title="Opprett ny flair"
                    submitText="Opprett flair"
                    action={createFlairAction}
                    closePopUpOnSuccess="CreateFlair"
                    refreshOnSuccess
                >
                    <TextInput label="Navn" name="name" />
                    <ColorInput label="Farge" name="color" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <p>
                Flairen med lavest <strong>rank</strong> er den som vises først på brukerens profil, og
                den som bestemmer fargen på brukerprofilen. Dra i håndtaket for å endre rekkefølgen.
            </p>
            <FlairTable rows={rows} />
        </PageWrapper>
    )
}
