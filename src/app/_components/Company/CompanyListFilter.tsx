'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextInput from '@/UI/TextInput'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import styles from './CompanyListFilter.module.scss'
import { useDebounce } from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { QueryParams } from '@/lib/query-params/queryParams'

type PropTypes = {
    currentName: string
}

export default function CompanyListFilter({ currentName }: PropTypes) {
    const { push } = useRouter()
    const setNameFilter = useDebounce((name: string) => {
        push(`/career/companies/?${QueryParams.companyName.encodeUrl(name)}`)
    }, 300)

    return (
        <span className={styles.CompanyListFilter}>
            <FontAwesomeIcon icon={faSearch} />
            <TextInput onChange={(e) => setNameFilter(e.target.value)} defaultValue={currentName} label="navn" />
        </span>
    )
}
