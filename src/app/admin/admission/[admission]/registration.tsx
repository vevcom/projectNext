'use client'

import styles from './registration.module.scss'
import { createAdmissionTrialAction } from '@/actions/admission/create'
import Form from '@/components/Form/Form'
import OmegaIdReader from '@/components/OmegaId/reader/OmegaIdReader'
import TextInput from '@/components/UI/TextInput'
import type { Admission } from '@prisma/client'


export default function RegisterAdmissiontrial({
    admission,
    omegaIdPublicKey,
}: {
    admission: Admission,
    omegaIdPublicKey: string,
}) {
    return <div className={styles.registration}>
        <h4>Registrer med QR kode</h4>
        <OmegaIdReader
            publicKey={omegaIdPublicKey}
            successCallback={async (user) => {
                const results = await createAdmissionTrialAction(admission, user.id)

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
            action={createAdmissionTrialAction.bind(null, admission)}
        >
            <TextInput name="userId" label="userId" />
        </Form>
    </div>
}
