'use server'

import MailFlow from './MailFlow'
import styles from './page.module.scss'
import EditMailAlias from './(editComponents)/mailAlias'
import EditMailingList from './(editComponents)/mailingList'
import EditMailAddressExternal from './(editComponents)/mailAddressExternal'
import EditUser from './(editComponents)/user'
import EditGroup from './(editComponents)/group'
import { readAllMailOptions, readMailFlowAction } from '@/actions/mail/read'
import { MailListTypeArray } from '@/server/mail/Types'
import PageWrapper from '@/app/components/PageWrapper/PageWrapper'
import { notFound } from 'next/navigation'
import type { MailListTypes } from '@/server/mail/Types'

export default async function MailFlowPage({
    params
}: {
    params: {
        filter: string,
        id: string,
    }
}) {
    if (!MailListTypeArray.includes(params.filter as MailListTypes /* This is bad practice, but typescript is stupid here */)) {
        notFound()
    }

    const id = Number(params.id)
    if (!id || id <= 0) {
        notFound()
    }

    const filter = params.filter as MailListTypes

    const [results, mailOptions] = await Promise.all([
        readMailFlowAction(filter, id),
        readAllMailOptions(),
    ])

    if (!results.success && results.errorCode === 'NOT FOUND') {
        notFound()
    } else if (!results.success || !mailOptions.success) {
        throw new Error('Could not fecth mail flow')
    }

    return <PageWrapper
        title="Innkommende elektronisk post"
    >
        <div className={styles.editContainer}>
            {filter === 'mailingList' ? <EditMailingList
                id={id}
                data={results.data}
                mailaliases={mailOptions.data.alias}
                mailAddressExternal={mailOptions.data.mailaddressExternal}
            /> : null}
            {filter === 'alias' ? <EditMailAlias
                id={id}
                data={results.data}
                mailingLists={mailOptions.data.mailingList}
            /> : null}
            {filter === 'mailaddressExternal' ? <EditMailAddressExternal
                id={id}
                data={results.data}
                mailingLists={mailOptions.data.mailingList}
            /> : null}
            {filter === 'user' ? <EditUser
                id={id}
                data={results.data}
                mailingLists={mailOptions.data.mailingList}
            /> : null}
            {filter === 'group' ? <EditGroup
                id={id}
                data={results.data}
                mailingLists={mailOptions.data.mailingList}
            /> : null}
        </div>
        <MailFlow filter={filter} id={id} data={results.data} />
    </PageWrapper>
}
