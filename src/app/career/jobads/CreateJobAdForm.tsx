'use client'
import styles from './CreateJobAdForm.module.scss'
import { createJobAdAction } from '@/actions/career/jobAds/create'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import React, { ChangeEvent, useContext } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/navigation'
import { SelectString } from '@/components/UI/Select'
import { JobTypeOptions } from '@/services/career/jobAds/ConfigVars'
import DateInput from '@/components/UI/DateInput'
import { CompanySelectionContext } from '@/contexts/CompanySelection'
import CompanyChooser from './CompanyChooser'

export default function CreateJobAdForm() {
    const { refresh } = useRouter()
    const companyCtx = useContext(CompanySelectionContext)

    if (!companyCtx) {
        throw new Error('CompanySelectionContext or companyPaging is not defined')
    }
    return (
        <div className={styles.CreateJobAdForm}>
            <Form
                title="Lag en ny stillingsannonse"
                submitText="Opprett"
                action={createJobAdAction.bind(null, {})}
                successCallback={refresh}
            >
                <TextInput label="Tittel" name="articleName" key={uuid()}/>
                <TextInput label="Beskrivelse" name="description" key={uuid()}/>
                { companyCtx.selectedCompany ? (
                    <>
                        <div>{companyCtx.selectedCompany.name}</div>
                        <input name="companyId" type="hidden" value={companyCtx.selectedCompany.id} /> 
                    </>
                ) : (
                    <div>Velg en bedrift</div>
                ) }
                <SelectString options={JobTypeOptions} label="Type" name="type" key={uuid()}/>
                <DateInput includeTime label="Søknadsfrist" name="applicationDeadline"/>
            </Form>
            <CompanyChooser className={styles.companyList} />
        </div>
    )
}
