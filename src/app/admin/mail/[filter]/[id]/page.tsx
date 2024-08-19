'use server'

import { readMailOptions, readMailFlowAction } from '@/actions/mail/read'
import { MailListTypeArray } from '@/server/mail/Types'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { notFound } from 'next/navigation'
import type { MailListTypes } from '@/server/mail/Types'
import { MailDisplayLabels } from './ConfigVars'
import { getDisplayTextFromFlowOject } from './common'
import ClientStateWrapper from './clientStateWrapper'

export default async function MailFlowPage({
    params
}: {
    params: {
        filter: string,
        id: string,
    }
}) {
    if (!MailListTypeArray.includes(params.filter as MailListTypes)) {
        notFound()
    }

    const id = Number(params.id)
    if (!id || id <= 0) {
        notFound()
    }

    const filter = params.filter as MailListTypes

    const [results, mailOptions] = await Promise.all([
        readMailFlowAction(filter, id),
        readMailOptions(),
    ])

    if (!results.success && results.errorCode === 'NOT FOUND') {
        notFound()
    } else if (!results.success || !mailOptions.success) {
        throw new Error('Could not fecth mail flow')
    }

    let displayName = getDisplayTextFromFlowOject(filter, results.data)

    return <PageWrapper
        title={`${MailDisplayLabels[filter]}: ${displayName}`}
    >
        <ClientStateWrapper
            filter={filter}
            id={id}
            mailFlow={results.data}
            mailOptions={mailOptions.data}
        />
    </PageWrapper>
}
