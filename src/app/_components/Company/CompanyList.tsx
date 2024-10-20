'use client'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import type { ReactNode } from 'react'
import { companyListRenderer } from './CompanyListRenderer'
import { CompanyPagingContext } from '@/contexts/paging/CompanyPaging'

type PropTypes = {
    serverRenderedData: ReactNode,
}

export default function CompanyList({ serverRenderedData }: PropTypes) {
    return (
        <div>
            {serverRenderedData}
            <EndlessScroll 
                pagingContext={CompanyPagingContext} 
                renderer={data => companyListRenderer(true)(data)} 
            />
        </div>
    )
}
