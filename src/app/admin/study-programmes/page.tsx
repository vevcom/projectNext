'use server'

import UpdateStudyProgrammeForm from './updateStudyProgrammeForm'
import StudyProgrammeTableBody from './studyProgrammeTable'
import styles from './page.module.scss'
import { readStudyProgrammesAction } from '@/actions/groups/studyProgrammes/read'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { getUser } from '@/auth/getUser'


export default async function StudyProgrammes() {
    const { permissions } = await getUser({
        requiredPermissions: [['STUDY_PROGRAMME_READ']],
        shouldRedirect: true,
    })

    const studyprogrammes = await readStudyProgrammesAction()

    if (!studyprogrammes.success) {
        console.log(studyprogrammes)
        return <div>Ups, an error occured</div>
    }

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
                {canEdit && <th>Rediger</th>}
                <th>Navn</th>
                <th>Kode</th>
                <th>Institutt kode</th>
                <th>Start år</th>
                <th>Lengde på studiet</th>
                <th>Del av Omega</th>
            </thead>
            <StudyProgrammeTableBody studyprogrammes={studyprogrammes.data} canEdit={canEdit} />
        </table>
    </PageWrapper>
}
