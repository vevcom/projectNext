import styles from './page.module.scss'
import ChangeName from './ChangeName'
import OmbulAdmin from './OmbulAdmin'
import { readOmbul } from '@/actions/ombul/read'
import PdfDocument from '@/components/PdfDocument/PdfDocument'
import { requireUser } from '@/auth'
import SlideInOnView from '@/app/components/SlideInOnView/SlideInOnView'
import EditableTextField from '@/app/components/EditableTextField/EditableTextField'
import { updateOmbul } from '@/actions/ombul/update'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: {
        yearAndName: string[]
    }
}

export default async function Ombul({ params }: PropTypes) {
    
    const user = await requireUser({
        permissions: ['OMBUL_READ']
    })

    const year = parseInt(decodeURIComponent(params.yearAndName[0]), 10)
    const name = decodeURIComponent(params.yearAndName[1])
    if (!year || !name || params.yearAndName.length > 2) notFound()
    const ombulRes = await readOmbul({
        name,
        year
    })
    if (!ombulRes.success) notFound()
    const ombul = ombulRes.data

    const path = `/store/ombul/${ombul.fsLocation}`

    const canUpdate = user.permissions.includes('OMBUL_UPDATE')
    const canDestroy = user.permissions.includes('OMBUL_DESTROY')

    const changeDescription = updateOmbul.bind(null, ombul.id)

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
                <OmbulAdmin
                    canDestroy={canDestroy}
                    canUpdate={canUpdate}
                    ombul={ombul}
                />
            </div>
        </div>
    )
}
