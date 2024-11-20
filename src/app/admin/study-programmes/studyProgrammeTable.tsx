'use client'

import styles from './studyProgrammeTable.module.scss'
import UpdateStudyProgrammeForm from './updateStudyProgrammeForm'
import PopUp from '@/components/PopUp/PopUp'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuid } from 'uuid'
import type { StudyProgramme } from '@prisma/client'


export default function StudyProgrammeTableBody({
    studyprogrammes,
    canEdit
}: {
    studyprogrammes: StudyProgramme[],
    canEdit: boolean,
}) {
    return <tbody>
        {studyprogrammes.map(s =>
            <tr key={uuid()}>
                {canEdit && <td className={styles.editButtonWrapper}><PopUp
                    showButtonContent={<FontAwesomeIcon icon={faPencil} />}
                    showButtonClass={styles.editButton}
                    PopUpKey={uuid()}
                >
                    <UpdateStudyProgrammeForm studyProgramme={s} />
                </PopUp></td>}
                <th>{s.name}</th>
                <td>{s.code}</td>
                <td>{s.insititueCode ?? ''}</td>
                <td>{s.startYear ?? ''}</td>
                <td>{s.yearsLength ?? ''}</td>
                <td>{s.partOfOmega ? 'Ja' : 'Nei'}</td>
            </tr>
        )}
    </tbody>
}
