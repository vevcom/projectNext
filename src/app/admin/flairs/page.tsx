import styles from './page.module.scss'
import { createFlairAction, readAllFlairsAction } from '@/services/flairs/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import Form from '@/components/Form/Form'
import ColorInput from '@/components/UI/ColorInput'
import TextInput from '@/components/UI/TextInput'
import Flair from '@/components/Flair/Flair'
import { ServerSession } from '@/auth/session/ServerSession'
import Link from 'next/link'


export default async function FlairUpdatePage() {
    const flairs = unwrapActionReturn(await readAllFlairsAction())
    const session = await ServerSession.fromNextAuth()

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
            <div className={styles.wrapper}>
                <div className={styles.flairContainer}>
                    {flairs.map((flair, index) => (
                        <Link className={styles.imageContainer} key={index} href={`/admin/flairs/${flair.id}`}>
                            <h3>{flair.name}</h3>
                            <Flair session={session} flair={flair} width={100} />
                        </Link>
                    ))}
                </div>
            </div >
        </PageWrapper>
    )
}
