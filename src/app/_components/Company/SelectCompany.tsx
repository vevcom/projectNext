'use client'
import { CompanySelectionContext } from "@/contexts/CompanySelection"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Company } from "@prisma/client"
import { useContext } from "react"
import styles from "./SelectCompany.module.scss"

type PropTypes = {
    company: Company
}

/**
 * Component used in Company. If rendered inside CompanySelectionProvider, it will allow the user to select a company.
 * @param company The company to select when the button is clicked.
 */
export default function SelectCompany({ company }: PropTypes) {
    const companyCtx = useContext(CompanySelectionContext)
    if (!companyCtx) return <></>
    const isSelected = companyCtx.selectedCompany && companyCtx.selectedCompany.id === company.id
    return (
        <>
        <button className={styles.button} onClick={() => {
            if (isSelected) {
                companyCtx.setSelectedCompany(null)
                return
            }
            companyCtx.setSelectedCompany(company)
        }} />
        <div className={isSelected ? `${styles.selected} ${styles.check}` : styles.check}>
            <FontAwesomeIcon icon={faCheck} />
        </div>
        </>
    )
}
