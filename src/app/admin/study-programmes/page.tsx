'use server'

import UpdateStudyProgrammeForm from './updateStudyProgrammeForm'
import StudyProgrammeTableBody from './studyProgrammeTable'
import styles from './page.module.scss'
import { readStudyProgrammesAction } from '@/services/groups/studyProgrammes/actions'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { studyProgrammeAuth } from '@/services/groups/studyProgrammes/auth'
import { ServerSession } from '@/auth/session/ServerSession'


export default async function StudyProgrammes() {
    const studyprogrammes = unwrapActionReturn(await readStudyProgrammesAction())

    const showCreateButton = studyProgrammeAuth.create.dynamicFields({}).auth(await ServerSession.fromNextAuth())
    const canEdit = studyProgrammeAuth.update.dynamicFields({}).auth(await ServerSession.fromNextAuth())


    return <PageWrapper
        title="Studieprogrammer"
        headerItem={
            showCreateButton.authorized && (
                <AddHeaderItemPopUp popUpKey="create ombul">
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
            <StudyProgrammeTableBody studyprogrammes={studyprogrammes} canEdit={canEdit.authorized} />
        </table>
    </PageWrapper>
}
