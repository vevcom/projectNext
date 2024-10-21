'use client'
import CompanyList from '@/components/Company/CompanyList'
import TextInput from '@/components/UI/TextInput'
import Link from 'next/link'
import styles from './CompanyChooser.module.scss'
import { ChangeEvent, useContext } from 'react'
import { CompanyPagingContext } from '@/contexts/paging/CompanyPaging'

type PropTypes = {
    className?: string
}

export default function CompanyChooser({ className }: PropTypes) {
    const companyPagingCtx = useContext(CompanyPagingContext)

    if (!companyPagingCtx) {
        throw new Error('CompanyPagingContext is not defined')
    }

    const handleNameFilter = (e: ChangeEvent<HTMLInputElement>) => {
        companyPagingCtx.setDetails({ name: e.target.value })
    }

    return (
        <div className={`${styles.CompanyChooser} ${className}`}>
            <TextInput className={styles.filter} label='Søk Navn' name='name' onChange={handleNameFilter} />
            <Link href="/career/companies">Administrer bedrifter</Link>
            <CompanyList disableEditing serverRenderedData={[]} />
        </div>
    )
}
