'use server'

import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { AdmissionDisplayNames } from '@/server/admission/ConfigVars'
import { Admission, type Admission as AdmissionType } from '@prisma/client'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'


export default async function AdmissionTrials() {
    
    const admissions = Object.keys(Admission) as AdmissionType[]

    return <PageWrapper
        title="Registrer opptak"
    >
        <ul>
            {admissions.map(a => <li key={uuid()}><Link href={`admissiontrials/${a}`}>{AdmissionDisplayNames[a]}</Link></li>)}
        </ul>

    </PageWrapper>
}
