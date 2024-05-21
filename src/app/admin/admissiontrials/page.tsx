"use server"

import { readAllActiveAdmissionsAction } from "@/actions/admission/read"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"
import Link from "next/link"
import { v4 as uuid } from "uuid"



export default async function AdmissionTrials() {

    const admissions = await readAllActiveAdmissionsAction()
    
    if (!admissions.success) {
        return <>Failed to load admissions</>
    }

    return <PageWrapper
        title="Registrer opptak"
    >
        <ul>
            {admissions.data.map(a => <li key={uuid()}><Link href={`admissiontrials/${a.id}`}>{a.name}</Link></li>)}
        </ul>

    </PageWrapper>
}