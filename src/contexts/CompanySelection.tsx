'use client'
import { createContext, useState, type ReactNode } from 'react'
import type { Company } from '@prisma/client'

export const CompanySelectionContext = createContext<{
    selectedCompany: Company | null,
    setSelectedCompany: (company: Company | null) => void,
        } | null>(null)

type PropTypes = {
    children: ReactNode,
    company: Company | null,
}

export default function CompanySelectionProvider({ children, company }: PropTypes) {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(company)

    return (
        <CompanySelectionContext.Provider value={{
            selectedCompany,
            setSelectedCompany,
        }}>
            {children}
        </CompanySelectionContext.Provider>
    )
}
