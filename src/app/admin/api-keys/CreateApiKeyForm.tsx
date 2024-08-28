'use client'
import styles from './CreateApiKeyForm.module.scss'
import Form from '@/app/components/Form/Form'
import { createApiKeyAction } from '@/actions/api-keys/create'
import TextInput from '@/app/components/UI/TextInput'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

export default function CreateApiKeyForm() {
    const [apiKeyToShow, setApiKeyToShow] = useState<string | null>(null)
    const [copySuccess, setCopySuccess_] = useState<string | null>(null)

    const setCopySuccess = (msg: string | null) => {
        setCopySuccess_(msg)
        setTimeout(() => setCopySuccess_(null), 5_000)
    }

    const showApiKey = (key: string | undefined) => {
        setApiKeyToShow(key ?? null)
        setTimeout(() => setApiKeyToShow(null), 20_000)
    }

    const copyAPIKeyToClipboard = () => {
        if (!apiKeyToShow) return setCopySuccess('Ingen nøkkel å kopiere')
        return navigator.clipboard.writeText(apiKeyToShow).then(
            () => setCopySuccess('Kopiert!')
        ).catch(
            () => setCopySuccess('Kunne ikke kopiere nøkkel')
        )
    }

    return (
        <div className={styles.CreateApiKeyForm}>
            <Form
                title="Lag en ny nøkkel"
                action={createApiKeyAction}
                successCallback={data => showApiKey(data?.key)}
            >
                <TextInput name="name" label="Navn" />
            </Form>
            {apiKeyToShow && (
                <div className={styles.keyHolder}>
                    <p className={styles.ApiKey}>{apiKeyToShow}</p>
                    <button onClick={copyAPIKeyToClipboard}>
                        <FontAwesomeIcon icon={faCopy} />
                    </button>
                </div>
            )}

            {copySuccess && <p>{copySuccess}</p>}
        </div>
    )
}
