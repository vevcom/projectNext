'use server'

import RegisterAdmissiontrial from './registration'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readOmegaJWTPublicKey } from '@/actions/omegaid/read'
import { AdmissionDisplayNames } from '@/services/admission/ConfigVars'
import { Admission, type Admission as AdmissionType } from '@prisma/client'
import { notFound } from 'next/navigation'


export default async function AdmissionTrials({
    params,
}: {
    params: {
        admission: string
    }
}) {
    if (!Object.keys(Admission).includes(params.admission)) {
        notFound()
    }
    const admission = params.admission as AdmissionType

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
