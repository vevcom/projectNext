'use client'

import styles from './registration.module.scss'
import { createAdmissionTrialAction } from '@/actions/admission/trial/create'
import Form from '@/app/components/Form/Form'
import OmegaIdReader from '@/app/components/OmegaId/reader/OmegaIdReader'
import TextInput from '@/app/components/UI/TextInput'
import type { Admissions } from '@prisma/client'


export default function RegisterAdmissiontrial({
    admission,
    omegaIdPublicKey,
}: {
    admission: Admissions,
    omegaIdPublicKey: string,
}) {
    return <div className={styles.registration}>
        <h4>Registrer med QR kode</h4>
        <OmegaIdReader
            publicKey={omegaIdPublicKey}
            successCallback={async (user) => {
                const results = await createAdmissionTrialAction(admission.id, user.id)

                let msg = results.success ? 
                    `${user.firstname} er registrert` :
                    'Kunne ikke regisrere bruker grunnet en ukjent feil.' 
                
                if (!results.success && results.error) {
                    msg = `${user.firstname}: ${
                        results.error
                            .map(e => e.message)
                            .reduce((acc, val) => `${acc}\n${val}`, '')
                    }`
                }
                
                return {
                    success: results.success,
                    text: msg,
                }
            }}
        />

        <h4>Registrer manuelt</h4>
        <Form
            submitText="Registrer"
            action={createAdmissionTrialAction.bind(null, admission.id)}
        >
            <TextInput name="userId" label="userId" />
        </Form>
    </div>
}
