import RegisterAdmissiontrial from './registration'
import { admissionDisplayNames, allAdmissions } from '@/services/admission/constants'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readOmegaJWTPublicKey } from '@/services/omegaid/actions'
import { notFound } from 'next/navigation'
import { type Admission as AdmissionType } from '@/prisma-generated-pn-types'

type PropTypes = {
    params: Promise<{
        admission: AdmissionType
    }>
}

export default async function AdmissionTrials({ params }: PropTypes) {
    if (!allAdmissions.includes((await params).admission)) {
        notFound()
    }

    const admission = (await params).admission

    const publicKey = await readOmegaJWTPublicKey()

    return <PageWrapper
        title={`Registrer opptak for ${admissionDisplayNames[admission]}`}
    >
        <RegisterAdmissiontrial
            admission={admission}
            omegaIdPublicKey={publicKey}
        />

    </PageWrapper>
}
