'use client'
import styles from './EditJobAd.module.scss'
import SelectedCompany from '@/career/jobads/SelectedCompany'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import useEditing from '@/hooks/useEditing'
import { SelectString } from '@/components/UI/Select'
import DateInput from '@/components/UI/DateInput'
import Slider from '@/app/_components/UI/Slider'
import { CompanyPagingContext } from '@/contexts/paging/CompanyPaging'
import CompanyChooser from '@/app/career/jobads/CompanyChooser'
import { bindParams } from '@/services/actionBind'
import { destroyJobAdAction, updateJobAdAction } from '@/career/jobAds/actions'
import { jobAdOptions } from '@/services/career/jobAds/constants'
import { v4 as uuid } from 'uuid'
import { useContext, type ReactNode } from 'react'
import type { ExpandedJobAd } from '@/career/jobAds/Types'

type PropTypes = {
    jobAd: ExpandedJobAd
    children?: ReactNode
}

/**
 * This component renders children if editmode is off and news admin tools if editmode is on
 * pass it not: id of jobad to make sure not to display that jobad
 * @param jobAd - the jobad to edit
 * @param children - children to render if editmode is off
 */
export default function EditJobAd({ jobAd, children }: PropTypes) {
    //TODO: chack visibility
    const canEdit = useEditing({})
    const companyPagingCtx = useContext(CompanyPagingContext)
    if (!canEdit) return children
    if (!companyPagingCtx) {
        throw new Error('CompanySelectionContext or companyPaging is not defined')
    }

    const updateAction = bindParams(updateJobAdAction, ({ id: jobAd.id }))

    return (
        <div className={styles.EditJobAd}>
            <div className={styles.update}>
                <Form
                    action={updateAction}
                    navigateOnSuccess={(data) => `/career/jobads/${data?.orderPublished}/${data?.articleName}`}
                    submitText="oppdater"
                >
                    <Textarea
                        defaultValue={jobAd.description || ''}
                        label="beskrivelse"
                        name="description"
                    />
                    <TextInput
                        defaultValue={jobAd.location || ''}
                        label="Sted"
                        name="location"
                        key={uuid()}
                    />
                    <SelectedCompany />
                    <SelectString
                        options={jobAdOptions}
                        label="Type"
                        name="type"
                        key={uuid()}
                        defaultValue={jobAd.type}
                    />
                    <DateInput
                        includeTime
                        label="Søknadsfrist"
                        name="applicationDeadline"
                        key={uuid()}
                        defaultValue={jobAd.applicationDeadline || ''}
                    />
                    <Slider
                        label="Aktiv"
                        name="active"
                        defaultChecked={jobAd.active}
                        color="primary"
                    />
                </Form>
                <Form
                    action={bindParams(destroyJobAdAction, ({ id: jobAd.id }))}
                    navigateOnSuccess="/career/jobads"
                    submitText="slett annonse"
                    confirmation={{
                        confirm: true,
                        text: 'Er du sikker på at du vil slette denne annonsen?' +
                        'Dette kan ikke angres. Vi anbefaler å sette annonsen' +
                        'til inaktiv i stedet.'
                    }}
                    submitColor="red"
                >
                </Form>
            </div>
            <CompanyChooser className={styles.companyChooser} />
        </div>
    )
}
