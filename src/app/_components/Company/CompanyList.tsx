'use client'
import { companyListRenderer } from './CompanyListRenderer'
import styles from './CompanyList.module.scss'
import { CompanyPagingContext } from '@/contexts/paging/CompanyPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import { useUser } from '@/auth/useUser'
import type { ReactNode } from 'react'

type PropTypes = {
    serverRenderedData: ReactNode,
    disableEditing?: boolean,
}

export default function CompanyList({ serverRenderedData, disableEditing }: PropTypes) {
    const ses = useUser()
    const session = {
        user: ses.user ?? null,
        permissions: ses.permissions ?? [],
        memberships: ses.memberships ?? [],
    }
    return (
        <div className={styles.CompanyList}>
            {serverRenderedData}
            <EndlessScroll
                pagingContext={CompanyPagingContext}
                renderer={data => companyListRenderer({ asClient: true, session, disableEditing })(data)}
            />
        </div>
    )
}
