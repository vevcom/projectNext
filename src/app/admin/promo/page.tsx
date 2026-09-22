import { createPromoAction, readAllPromosAction } from '@/services/promo/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import DateInput from '@/components/UI/DateInput'
import FileInput from '@/components/UI/FileInput'
import LicenseChooser from '@/components/LicenseChooser/LicenseChooser'
import SimpleTable from '@/components/Table/SimpleTable'
import Image from '@/components/Image/Image'

export default async function PromoAdminPage() {
    const promos = unwrapActionReturn(await readAllPromosAction())
    const now = new Date()

    return (
        <PageWrapper title="Administrer promo" headerItem={
            <AddHeaderItemPopUp popUpKey="CreatePromo">
                <Form
                    title="Opprett ny promo"
                    submitText="Opprett promo"
                    action={createPromoAction}
                    closePopUpOnSuccess="CreatePromo"
                    refreshOnSuccess
                >
                    <TextInput label="Tittel" name="title" />
                    <Textarea label="Tekst" name="text" />
                    <TextInput label="Lenke" name="link" />
                    <DateInput label="Fra" name="startDate" includeTime />
                    <DateInput label="Til" name="endDate" includeTime />
                    <FileInput label="Bakgrunnsbilde" name="imageFile" color="primary" />
                    <TextInput label="Alternativ tekst for bilde" name="imageAlt" />
                    <TextInput label="Kreditert" name="imageCredit" />
                    <LicenseChooser name="imageLicenseId" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <p>
                Promoen vises som en bar under forsidebildet, kun i perioden mellom fra- og til-dato.
                Er flere perioder aktive samtidig vises den som ble opprettet sist.
            </p>
            <SimpleTable
                header={['Bilde', 'Tittel', 'Periode', 'Status']}
                body={promos.map(promo => [
                    <Image key={promo.id} width={100} image={promo.image} hideCredit hideCopyRight />,
                    promo.title,
                    `${promo.startDate.toLocaleDateString('nb-NO')} – ${promo.endDate.toLocaleDateString('nb-NO')}`,
                    promo.startDate <= now && promo.endDate >= now ? 'Aktiv' : 'Inaktiv',
                ])}
                links={promos.map(promo => `/admin/promo/${promo.id}`)}
            />
        </PageWrapper>
    )
}
