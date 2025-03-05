'use server'

import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { AdmissionConfig } from '@/services/admission/config'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'


export default async function AdmissionTrials() {
    return (
        <PageWrapper title="Registrer opptak">
            <ul>
                {AdmissionConfig.array.map(trial =>
                    <li key={uuid()}>
                        <Link href={`admission/${trial}`}>{AdmissionConfig.displayNames[trial]}</Link>
                    </li>
                )}
            </ul>
        </PageWrapper>
    )
}
