'use client'
import styles from './CreateJobAdForm.module.scss'
import CompanyChooser from './CompanyChooser'
import SelectedCompany from './SelectedCompany'
import { createJobAdAction } from '@/services/career/jobAds/actions'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { SelectString } from '@/components/UI/Select'
import { JobAdConfig } from '@/services/career/jobAds/config'
import DateInput from '@/components/UI/DateInput'
import { v4 as uuid } from 'uuid'

export default function CreateJobAdForm() {
    return (
        <div className={styles.CreateJobAdForm}>
            <Form
                title="Lag en ny stillingsannonse"
                submitText="Opprett"
                action={createJobAdAction}
                refreshOnSuccess
            >
                <TextInput label="Tittel" name="articleName" key={uuid()}/>
                <TextInput label="Beskrivelse" name="description" key={uuid()}/>
                <TextInput label="Sted" name="location" key={uuid()}/>
                <SelectedCompany />
                <SelectString options={JobAdConfig.options} label="Type" name="type" key={uuid()}/>
                <DateInput includeTime label="Søknadsfrist" name="applicationDeadline"/>
            </Form>
            <CompanyChooser className={styles.companyList} />
        </div>
    )
}
