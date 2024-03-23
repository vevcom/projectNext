import styles from './page.module.scss'
import ChangeName from './ChangeName'
import OmbulAdmin from './OmbulAdmin'
import { readOmbulAction } from '@/actions/ombul/read'
import PdfDocument from '@/components/PdfDocument/PdfDocument'
import SlideInOnView from '@/app/components/SlideInOnView/SlideInOnView'
import EditableTextField from '@/app/components/EditableTextField/EditableTextField'
import { updateOmbulAction } from '@/actions/ombul/update'
import { getUser } from '@/auth/getUser'
import CmsImage from '@/app/components/Cms/CmsImage/CmsImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: {
        yearAndName: string[]
    }
}

export default async function Ombul({ params }: PropTypes) {
    const { user } = await getUser({
        requiredPermissions: [['OMBUL_READ']],
        userRequired: true,
        shouldRedirect: true,
    })

    const year = parseInt(decodeURIComponent(params.yearAndName[0]), 10)
    const name = decodeURIComponent(params.yearAndName[1])
    if (!year || !name || params.yearAndName.length > 2) notFound()
    const ombulRes = await readOmbulAction({
        name,
        year
    })
    if (!ombulRes.success) notFound()
    const ombul = ombulRes.data

    const path = `/store/ombul/${ombul.fsLocation}`

    const canUpdate = user.permissions.includes('OMBUL_UPDATE')

    const changeDescription = updateOmbulAction.bind(null, ombul.id)

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
                    submitButton={{
                        name: 'description',
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
                    <CmsImage cmsImage={ombul.coverImage} width={400}/>
                </OmbulAdmin>
            </div>
        </div>
    )
}
