'use client'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import type { ReactNode } from 'react'
import { companyListRenderer } from './CompanyListRenderer'
import { CompanyPagingContext } from '@/contexts/paging/CompanyPaging'
import styles from './CompanyList.module.scss'
import { useUser } from '@/auth/useUser'
import { permission } from 'process'

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
