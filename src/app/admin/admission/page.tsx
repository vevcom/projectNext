'use server'

import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { AdmissionDisplayNames, AdmissionsArray } from '@/server/admission/ConfigVars'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'


export default async function AdmissionTrials() {
    return (
        <PageWrapper title="Registrer opptak">
            <ul>
                {AdmissionsArray.map(trial =>
                    <li key={uuid()}>
                        <Link href={`admissiontrials/${trial}`}>{AdmissionDisplayNames[trial]}</Link>
                    </li>
                )}
            </ul>
        </PageWrapper>
    )
}
