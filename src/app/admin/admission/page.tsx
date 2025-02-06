'use server'

import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { admissionConfig } from '@/services/admission/ConfigVars'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'


export default async function AdmissionTrials() {
    return (
        <PageWrapper title="Registrer opptak">
            <ul>
                {admissionConfig.array.map(trial =>
                    <li key={uuid()}>
                        <Link href={`admission/${trial}`}>{admissionConfig.displayNames[trial]}</Link>
                    </li>
                )}
            </ul>
        </PageWrapper>
    )
}
