'use server'

import UpdateStudyProgrammeForm from './updateStudyProgrammeForm'
import StudyProgrammeTableBody from './studyProgrammeTable'
import styles from './page.module.scss'
import { readStudyProgrammesAction } from '@/services/groups/studyProgrammes/actions'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'


export default async function StudyProgrammes() {
    const studyprogrammes = unwrapActionReturn(await readStudyProgrammesAction())

    const showCreateButton = permissions.includes('STUDY_PROGRAMME_CREATE')
    const canEdit = permissions.includes('STUDY_PROGRAMME_UPDATE')


    return <PageWrapper
        title="Studieprogrammer"
        headerItem={
            showCreateButton && (
                <AddHeaderItemPopUp PopUpKey="create ombul">
                    <UpdateStudyProgrammeForm />
                </AddHeaderItemPopUp>
            )
        }
    >
        <table className={styles.table}>
            <thead>
                <tr>
                    {canEdit && <th>Rediger</th>}
                    <th>Navn</th>
                    <th>Kode</th>
                    <th>Institutt kode</th>
                    <th>Start år</th>
                    <th>Lengde på studiet</th>
                    <th>Del av Omega</th>
                </tr>
            </thead>
            <StudyProgrammeTableBody studyprogrammes={studyprogrammes} canEdit={canEdit} />
        </table>
    </PageWrapper>
}
