'use server'

import RegisterAdmissiontrial from './registration'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readOmegaJWTPublicKey } from '@/actions/omegaid/read'
import { admissionConfig } from '@/services/admission/ConfigVars'
import { type Admission as AdmissionType } from '@prisma/client'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: Promise<{
        admission: AdmissionType
    }>
}

export default async function AdmissionTrials({ params }: PropTypes) {
    if (!admissionConfig.array.includes((await params).admission)) {
        notFound()
    }
    const admission = (await params).admission

    const publicKey = await readOmegaJWTPublicKey()

    return <PageWrapper
        title={`Registrer opptak for ${admissionConfig.displayNames[admission]}`}
    >
        <RegisterAdmissiontrial
            admission={admission}
            omegaIdPublicKey={publicKey}
        />

    </PageWrapper>
}
