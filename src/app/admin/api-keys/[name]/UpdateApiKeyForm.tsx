'use client'
import { updateApiKeyAction } from '@/actions/api-keys/update'
import Form from '@/app/_components/Form/Form'
import type { ReactNode } from 'react'

type PropTypes = {
    id: number,
    children: ReactNode
}

/**
 * Wrapper for a form calling updateApiKeyAction on submit - does not contain any fields as they should be servere side rendered
 * On success navigates to the updated api key by name.
 * @returns
 */
export default function UpdateApiKeyForm({ id, children }: PropTypes) {
    const updateAction = updateApiKeyAction.bind(null, id)

    return (
        <Form
            action={updateAction}
            submitText="Oppdater"
            navigateOnSuccess={data => (data ? `/admin/api-keys/${data.name}` : '/admin/api-keys')}
            refreshOnSuccess
        >
            {children}
        </Form>
    )
}
