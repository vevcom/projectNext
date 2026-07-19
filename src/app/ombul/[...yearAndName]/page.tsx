import styles from './page.module.scss'
import ChangeName from './ChangeName'
import OmbulAdmin from './OmbulAdmin'
import OmbulCover from '@/app/ombul/OmbulCover'
import { readOmbulAction, updateOmbulParagraphContentAction } from '@/services/ombul/actions'
import PdfDocument from '@/components/PdfDocument/PdfDocument'
import CmsParagraph from '@/components/Cms/CmsParagraph/CmsParagraph'
import PopUp from '@/components/PopUp/PopUp'
import { ServerSession } from '@/auth/session/ServerSession'
import { configureAction } from '@/services/configureAction'
import { ombulAuth } from '@/services/ombul/auth'
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

    const session = await ServerSession.fromNextAuth()
    const canUpdate = ombulAuth.update.dynamicFields({}).auth(session)
    const canUpdateParagraph = ombulAuth.updateParagraphContent.dynamicFields({}).auth(session).toJsObject()

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <ChangeName editable={canUpdate.authorized} ombulId={ombul.id}>
                    <h1>{ombul.name}</h1>
                </ChangeName>
                <p>{ombul.year} - {ombul.issueNumber}</p>
            </div>
            <div className={styles.coverAndParagraph}>
                <OmbulCover ombul={ombul} />
                <CmsParagraph
                    canEdit={canUpdateParagraph}
                    cmsParagraph={ombul.paragraph}
                    updateCmsParagraphAction={configureAction(
                        updateOmbulParagraphContentAction,
                        { implementationParams: { ombulId: ombul.id } }
                    )}
                />
            </div>
            <div className={styles.nav}>
                <div className={styles.download}>
                    <a href={path} download>Last ned</a>
                </div>
                <div className={styles.openInBrowser}>
                    <Link href={path} target="blank">Åpne i ny fane</Link>
                </div>
                <div className={styles.readPdf}>
                    <PopUp
                        popUpKey={`OmbulPdfViewer${ombul.id}`}
                        showButtonContent="Les PDF"
                    >
                        <PdfDocument src={path} className={styles.book} />
                    </PopUp>
                </div>
            </div>
            <div className={styles.admin}>
                <OmbulAdmin ombul={ombul} />
            </div>
        </div>
    )
}
