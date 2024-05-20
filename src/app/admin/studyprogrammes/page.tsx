'use server'

import UpdateStudyProgrammeForm from './updateStaudyProgrammeForm'
import StudyProgramTableBody from './studyProgramTable'
import { readAllStudyProgrammesAction } from '@/actions/groups/studyProgrammes/read'
import AddHeaderItemPopUp from '@/app/components/AddHeaderItem/AddHeaderItemPopUp'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { getUser } from '@/auth/getUser'


export default async function StudyProgrammes() {
    const { permissions } = await getUser({
        requiredPermissions: [['STUDY_PROGRAMME_READ']],
        shouldRedirect: true,
    })

    const studyprogrammes = await readAllStudyProgrammesAction()

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
        <table>
            <thead>
                {canEdit && <th>Rediger</th>}
                <th>Navn</th>
                <th>Kode</th>
                <th>Institutt kode</th>
                <th>Start år</th>
                <th>Lengde på studiet</th>
                <th>Del av Omega</th>
            </thead>
            <StudyProgramTableBody studyprogrammes={studyprogrammes.data} canEdit={canEdit} />
        </table>
    </PageWrapper>
}
