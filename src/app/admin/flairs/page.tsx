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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'


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
            <table className={styles.flairList}>
                <thead>
                    <tr>
                        <th>Bilde</th>
                        <th>Navn</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {flairs.map((flair) => (
                        <tr key={flair.id}>
                            <td>
                                <Flair session={session} flair={flair} width={100} />
                            </td>
                            <td>{flair.name}</td>
                            <td>
                                <Link className={styles.imageContainer} href={`/admin/flairs/${flair.id}`}>
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                    Rediger
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PageWrapper>
    )
}
