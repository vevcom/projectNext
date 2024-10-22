'use client'
import { CompanySelectionContext } from "@/contexts/CompanySelection"
import { useContext } from "react"

/**
 * Component for displaying the selected company in the CompanySelectionContext
 * @returns The selected company
 */
export default function SelectedCompany() {
    const companyCtx = useContext(CompanySelectionContext)

    if (!companyCtx) {
        throw new Error('CompanySelectionContext or companyPaging is not defined')
    }
    return (
        companyCtx.selectedCompany ? (
            <>
                <div>{companyCtx.selectedCompany.name}</div>
                <input name="companyId" type="hidden" value={companyCtx.selectedCompany.id} /> 
            </>
        ) : (
            <div>Velg en bedrift</div>
        )
    )
}
