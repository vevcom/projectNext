import styles from './page.module.scss'
import ChangeName from './ChangeName'
import OmbulAdmin from './OmbulAdmin'
import { readOmbulAction, updateOmbulAction, updateOmbulCmsCoverImageAction } from '@/services/ombul/actions'
import PdfDocument from '@/components/PdfDocument/PdfDocument'
import SlideInOnView from '@/components/SlideInOnView/SlideInOnView'
import EditableTextField from '@/components/EditableTextField/EditableTextField'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import { configureAction } from '@/services/configureAction'
import { ombulAuth } from '@/services/ombul/auth'
import { Session } from '@/auth/session/Session'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: Promise<{
        yearAndName: string[]
    }>
}

export default async function Ombul({ params }: PropTypes) {
    const year = parseInt(decodeURIComponent((await params).yearAndName[0]), 10)
    const name = decodeURIComponent((await params).yearAndName[1])
    if (!year || !name || (await params).yearAndName.length > 2) notFound()
    const ombulRes = await readOmbulAction({
        params: {
            name,
            year
        }
    })
    if (!ombulRes.success) notFound()
    const ombul = ombulRes.data

    const path = `/store/ombul/${ombul.fsLocation}`

    const canUpdate = ombulAuth.update.dynamicFields({}).auth(await Session.fromNextAuth()).authorized

    const changeDescription = configureAction(
        updateOmbulAction,
        { params: { id: ombul.id } }
    )

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <ChangeName editable={canUpdate} ombulId={ombul.id}>
                    <h1>{ombul.name}</h1>
                </ChangeName>
                <p>{ombul.year} - {ombul.issueNumber}</p>
                <EditableTextField
                    editable={canUpdate}
                    formProps={{
                        action: changeDescription
                    }}
                    inputName="description"
                    submitButton={{
                        text: 'Endre',
                        className: styles.changeDescriptionButton,
                    }}
                >
                    <p>{ombul.description}</p>
                </EditableTextField>
            </div>
            <main>
                <SlideInOnView>
                    <PdfDocument src={path} className={styles.book} />
                </SlideInOnView>
                <embed className={styles.embedPdf} src={path} type="application/pdf" />
            </main>
            <div className={styles.nav}>
                <div className={styles.download}>
                    <a href={path} download>Last ned</a>
                </div>
                <div className={styles.openInBrowser}>
                    <Link href={path} target="blank">Åpne i ny fane</Link>
                </div>
            </div>
            <div className={styles.admin}>
                <OmbulAdmin ombul={ombul}>
                    <CmsImage
                        cmsImage={ombul.coverImage}
                        width={400}
                        updateCmsImageAction={
                            configureAction(
                                updateOmbulCmsCoverImageAction,
                                { implementationParams: { ombulId: ombul.id } }
                            )
                        }
                    />
                </OmbulAdmin>
            </div>
        </div>
    )
}
