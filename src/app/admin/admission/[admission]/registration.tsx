'use client'

import styles from './registration.module.scss'
import { bindParams } from '@/actions/bind'
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
            successCallback={async (userId) => {
                const results = await createAdmissionTrialAction({ admission }, { userId })

                let msg = results.success ?
                    `${results.data.user.firstname} ${results.data.user.lastname} er registrert` :
                    'Kunne ikke regisrere bruker grunnet en ukjent feil.'

                if (!results.success && results.error) {
                    msg = results.error
                        .map(e => e.message)
                        .reduce((acc, val) => `${acc}\n${val}`, '')
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
            action={bindParams(createAdmissionTrialAction, { admission })}
        >
            <TextInput name="userId" label="userId" />
        </Form>
    </div>
}
