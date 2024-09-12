'use server'

import RegisterAdmissiontrial from './registration'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readOmegaJWTPublicKey } from '@/actions/omegaid/read'
import { AdmissionDisplayNames, AdmissionsArray } from '@/services/admission/ConfigVars'
import { type Admission as AdmissionType } from '@prisma/client'
import { notFound } from 'next/navigation'

type PropTypes = {
    params: {
        admission: AdmissionType
    }
}

export default async function AdmissionTrials({ params }: PropTypes) {
    console.log(params)
    if (!AdmissionsArray.includes(params.admission)) {
        notFound()
    }
    const admission = params.admission

    const publicKey = await readOmegaJWTPublicKey()

    return <PageWrapper
        title={`Registrer opptak for ${AdmissionDisplayNames[admission]}`}
    >
        <RegisterAdmissiontrial
            admission={admission}
            omegaIdPublicKey={publicKey}
        />

    </PageWrapper>
}
