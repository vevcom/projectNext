'use server'

import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { admissionDisplayNames, allAdmissions } from '@/services/admission/config'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'


export default async function AdmissionTrials() {
    return (
        <PageWrapper title="Registrer opptak">
            <ul>
                {allAdmissions.map(trial =>
                    <li key={uuid()}>
                        <Link href={`admission/${trial}`}>{admissionDisplayNames[trial]}</Link>
                    </li>
                )}
            </ul>
        </PageWrapper>
    )
}
