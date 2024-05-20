"use client"

import PopUp from "@/app/components/PopUp/PopUp"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StudyProgramme } from "@prisma/client"
import { v4 as uuid } from "uuid"
import styles from "./studyProgramTable.module.scss"
import UpdateStudyProgrammeForm from "./updateStaudyProgrammeForm"


export default function StudyProgramTableBody({
    studyprogrammes,
    canEdit
}: {
    studyprogrammes: StudyProgramme[],
    canEdit: boolean,
}) {


    return <tbody>
        {studyprogrammes.map(s => 
            <tr>
                {canEdit && <PopUp
                    showButtonContent={<FontAwesomeIcon icon={faPencil} />}
                    showButtonClass={styles.editButton}
                    PopUpKey={uuid()}
                >
                    <UpdateStudyProgrammeForm studyProgram={s} />
                </PopUp>}
                <th>{s.name}</th>
                <td>{s.code}</td>
                <td>{s.insititueCode ?? ""}</td>
                <td>{s.startYear ?? ""}</td>
                <td>{s.yearsLength ?? ""}</td>
                <td>{s.partOfOmega ? "Ja" : "Nei"}</td>
            </tr>
        )}
    </tbody>
}