import styles from './Company.module.scss'
import SelectCompany from './SelectCompany'
import { SettingsHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import TextInput from '@/UI/TextInput'
import CmsImage from '@/cms/CmsImage/CmsImage'
import CmsImageClient from '@/cms/CmsImage/CmsImageClient'
import Form from '@/components/Form/Form'
import { companyAuth } from '@/services/career/companies/auth'
import {
    destroyCompanyAction,
    updateCompanyAction,
    updateCompanyCmsLogoAction
} from '@/services/career/companies/actions'
import { configureAction } from '@/services/configureAction'
import type { CompanyExpanded } from '@/services/career/companies/types'
import type { SessionMaybeUser } from '@/auth/session/Session'

type PropTypes = {
    company: CompanyExpanded,
    asClient: boolean,
    session: SessionMaybeUser,
    disableEdit?: boolean,
    logoWidth?: number,
    squareLogo?: boolean
}

/**
 *
 * @param company - The company to display
 * @param asClient - If the component is rendered clinet side (uses CmsImageClient)
 * @param session - The session of the user
 * @param disableEdit - If the edit buttons should be disabled even if the user has the rights
 * @param logoWidth - The width of the logo
 * @param squareLogo - If the logo should be square (contained in center of square frame)
 * @returns
 */
export default function Company({
    company,
    asClient,
    session,
    disableEdit = false,
    logoWidth = 300,
    squareLogo = true,
}: PropTypes) {
    const canUpdate = companyAuth.update.dynamicFields({}).auth(session)
    const canDestroy = companyAuth.destroy.dynamicFields({}).auth(session)
    const updateCmsImageAction = configureAction(
        updateCompanyCmsLogoAction,
        { implementationParams: { companyId: company.id } }
    )
    return (
        <div className={styles.Company}>
            {asClient ?
                <CmsImageClient
                    disableEditor={disableEdit}
                    className={squareLogo ? styles.logoSq : styles.logo}
                    cmsImage={company.logo}
                    width={logoWidth}
                    updateCmsImageAction={updateCmsImageAction}

                /> :
                <CmsImage
                    disableEditor={disableEdit}
                    className={squareLogo ? styles.logoSq : styles.logo}
                    cmsImage={company.logo}
                    width={logoWidth}
                    updateCmsImageAction={updateCmsImageAction}
                />
            }
            <div className={styles.info}>
                <h2>{company.name}</h2>
                <p>{company.description}</p>
                {
                    !disableEdit && (canUpdate.authorized || canDestroy.authorized) ? (
                        <SettingsHeaderItemPopUp showButtonClass={styles.showSettings} PopUpKey={`Edit ${company.id}`}>
                            <Form
                                title="Rediger Bedrift"
                                action={configureAction(updateCompanyAction, { params: { id: company.id } })}
                                refreshOnSuccess
                                closePopUpOnSuccess={`Edit ${company.id}`}
                                submitText="Lagre"
                            >
                                <TextInput name="name" label="Navn" defaultValue={company.name} />
                                <TextInput name="description" label="Beskrivelse" defaultValue={company.description} />
                            </Form>
                            <Form
                                action={configureAction(destroyCompanyAction, { params: { id: company.id } })}
                                refreshOnSuccess
                                closePopUpOnSuccess={`Edit ${company.id}`}
                                submitText="Slett"
                                submitColor="red"
                                confirmation={{
                                    confirm: true,
                                    text: 'Er du sikker på at du vil slette denne bedriften?'
                                }}
                            />
                        </SettingsHeaderItemPopUp>
                    ) : <></>
                }
            </div>
            <SelectCompany company={company} />
        </div>
    )
}
