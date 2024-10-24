'use client'
import styles from './CreateJobAdForm.module.scss'
import CompanyChooser from './CompanyChooser'
import SelectedCompany from './SelectedCompany'
import { createJobAdAction } from '@/actions/career/jobAds/create'
import TextInput from '@/components/UI/TextInput'
import Form from '@/components/Form/Form'
import { SelectString } from '@/components/UI/Select'
import { JobTypeOptions } from '@/services/career/jobAds/ConfigVars'
import DateInput from '@/components/UI/DateInput'
import { v4 as uuid } from 'uuid'

export default function CreateJobAdForm() {
    return (
        <div className={styles.CreateJobAdForm}>
            <Form
                title="Lag en ny stillingsannonse"
                submitText="Opprett"
                action={createJobAdAction.bind(null, {})}
                refreshOnSuccess
            >
                <TextInput label="Tittel" name="articleName" key={uuid()}/>
                <TextInput label="Beskrivelse" name="description" key={uuid()}/>
                <TextInput label="Sted" name="location" key={uuid()}/>
                <SelectedCompany />
                <SelectString options={JobTypeOptions} label="Type" name="type" key={uuid()}/>
                <DateInput includeTime label="Søknadsfrist" name="applicationDeadline"/>
            </Form>
            <CompanyChooser className={styles.companyList} />
        </div>
    )
}
