"use server"

import { readAdmissionAction, readAllAdmissionsAction } from "@/actions/admission/read"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"
import RegisterAdmissiontrial from "./registration"
import { readOmegaIdPublicKey } from "@/actions/omegaid/read"




export default async function AdmissionTrials({
    params,
}: {
    params: {
        admissionId: string
    }
}) {

    const admissionId = Number(params.admissionId)

    const [admission, publicKey] = await Promise.all([
        readAdmissionAction(admissionId),
        readOmegaIdPublicKey(),
    ])
    
    if (!admission.success) {
        return <>Failed to load admissions</>
    }

    return <PageWrapper
        title={`Registrer opptak for ${admission.data.name}`}
    >
        <RegisterAdmissiontrial
            admission={admission.data}
            omegaIdPublicKey={publicKey}
        />

    </PageWrapper>
}