'use client'
import { createOmegaOrderAction } from '@/actions/omegaOrder/create'
import Form from '@/components/Form/Form'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function CreateOrder() {
    const { refresh } = useRouter()

    return (
        <Form
            action={createOmegaOrderAction}
            successCallback={refresh}
            submitText="Inkrementer omega"
            confirmation={{
                confirm: true,
                text: 'Dette er en alvorlig operasjon å gjøre, er du sikker på at du vil fortsette?'
            }}
        />
    )
}
