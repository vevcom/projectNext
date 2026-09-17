import styles from './page.module.scss'
import {
    createFlairAction,
    decreaseFlairRankAction,
    increaseFlairRankAction,
    readAllFlairsAction,
    updateFlairImageAction
} from '@/services/flairs/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import Form from '@/components/Form/Form'
import ColorInput from '@/components/UI/ColorInput'
import TextInput from '@/components/UI/TextInput'
import FileInput from '@/components/UI/FileInput'
import LicenseChooser from '@/components/LicenseChooser/LicenseChooser'
import Flair from '@/components/Flair/Flair'
import ImageUploader from '@/components/Image/ImageUploader'
import PopUp from '@/components/PopUp/PopUp'
import { configureAction } from '@/services/configureAction'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'


export default async function FlairUpdatePage() {
    const flairs = unwrapActionReturn(await readAllFlairsAction()).sort((a, b) => a.rank - b.rank)

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
                    <FileInput label="Bilde" name="imageFile" color="primary" />
                    <TextInput label="Alternativ tekst for bilde" name="imageAlt" />
                    <TextInput label="Kreditert" name="imageCredit" />
                    <LicenseChooser name="imageLicenseId" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <p>
                Flairen med lavest <strong>rank</strong> er den som vises først på brukerens profil, og
                den som bestemmer fargen på brukerprofilen.
            </p>
            <table className={styles.flairList}>
                <thead>
                    <tr>
                        <th>Bilde</th>
                        <th>Navn</th>
                        <th>Farge</th>
                        <th>Rank</th>
                        <th>Rank opp</th>
                        <th>Rank ned</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {flairs.map((flair, i) => (
                        <tr key={flair.id}>
                            <td>
                                <Flair flair={flair} width={100} />
                                <PopUp
                                    popUpKey={`EditFlairImage${flair.id}`}
                                    showButtonContent="Endre bilde"
                                    showButtonClass={styles.changeImageBtn}
                                >
                                    <ImageUploader
                                        title={`Endre bilde for ${flair.name}`}
                                        refreshOnSuccess
                                        closePopUpOnSuccess={`EditFlairImage${flair.id}`}
                                        uploadImageAction={configureAction(
                                            updateFlairImageAction,
                                            { params: { flairId: flair.id } }
                                        )}
                                    />
                                </PopUp>
                            </td>
                            <td>{flair.name}</td>
                            <td style={{
                                backgroundColor: `rgb(${flair.colorR}, ${flair.colorG}, ${flair.colorB})`
                            }}></td>
                            <td>{flair.rank}</td>
                            <td>
                                {i > 0 ? (
                                    <Form
                                        refreshOnSuccess
                                        submitText={<>
                                            Opp <FontAwesomeIcon icon={faArrowUp} />
                                        </>}
                                        action={configureAction(
                                            increaseFlairRankAction,
                                            { params: { flairId: flair.id } }
                                        )}
                                    />
                                ) : null}
                            </td>
                            <td>
                                {i < flairs.length - 1 ? (
                                    <Form
                                        refreshOnSuccess
                                        submitText={<>
                                            Ned <FontAwesomeIcon icon={faArrowDown} />
                                        </>}
                                        action={configureAction(
                                            decreaseFlairRankAction,
                                            { params: { flairId: flair.id } }
                                        )}
                                    />
                                ) : null}
                            </td>
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
