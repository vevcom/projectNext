'use client'

import styles from './registration.module.scss'
import { createAdmissionTrialAction } from '@/actions/admission/trial/create'
import Form from '@/app/components/Form/Form'
import OmegaIdReader from '@/app/components/OmegaId/reader/OmegaIdReader'
import TextInput from '@/app/components/UI/TextInput'
import { useState } from 'react'
import type { Admissions } from '@prisma/client'


export default function RegisterAdmissiontrial({
    admission,
    omegaIdPublicKey,
}: {
    admission: Admissions,
    omegaIdPublicKey: string,
}) {
    const [feedback, setFeedBack] = useState({
        class: '',
        text: ''
    })

    return <div className={styles.registration}>
        <h4>Registrer med QR kode</h4>
        <OmegaIdReader
            publicKey={omegaIdPublicKey}
            showSuccessFeedback={false}
            successCallback={async (user) => {
                const results = await createAdmissionTrialAction(admission.id, user.id)
                if (results.success) {
                    setFeedBack({
                        class: styles.success,
                        text: `${user.firstname} er registrert`,
                    })
                } else if (results.error) {
                    setFeedBack({
                        class: styles.error,
                        text: `${user.firstname}: ${
                            results.error
                                .map(e => e.message)
                                .reduce((acc, val) => `${acc}\n${val}`, '')
                        }`,
                    })
                } else {
                    setFeedBack({
                        class: styles.error,
                        text: 'Kunne ikke regisrere bruker grunnet en ukjent feil.',
                    })
                }
            }}
        />

        <p className={`${feedback.class} ${styles.feedbackBox}`}>{feedback.text}</p>

        <h4>Registrer manuelt</h4>
        <Form
            submitText="Registrer"
            action={createAdmissionTrialAction.bind(null, admission.id)}
        >
            <TextInput name="userId" label="userId" />
        </Form>
    </div>
}
