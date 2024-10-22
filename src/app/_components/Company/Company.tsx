import { CompanyExpanded } from "@/services/career/companies/Types"
import CmsImage from "@/cms/CmsImage/CmsImage"
import CmsImageClient from "@/cms/CmsImage/CmsImageClient"
import styles from './Company.module.scss'
import { SessionMaybeUser } from "@/auth/Session"
import { DestroyCompanyAuther, UpdateCompanyAuther } from "@/services/career/companies/Authers"
import { SettingsHeaderItemPopUp } from "../HeaderItems/HeaderItemPopUp"
import Form from "@/components/Form/Form"
import { updateComanyAction } from "@/actions/career/companies/update"
import TextInput from "../UI/TextInput"
import { destroyCompanyAction } from "@/actions/career/companies/destroy"
import SelectCompany from "./SelectCompany"

type PropTypes = {
    company: CompanyExpanded,
    asClient: boolean,
    session: SessionMaybeUser,
    disableEdit?: boolean,
    logoWidth?: number,
}

export default function Company({ 
    company, 
    asClient, 
    session, 
    disableEdit = false, 
    logoWidth = 300 
}: PropTypes) {
    const canUpdate = UpdateCompanyAuther.dynamicFields({}).auth(session)
    const canDestroy = DestroyCompanyAuther.dynamicFields({}).auth(session)
    return (
        <div className={styles.Company}>
            { asClient ? 
                <CmsImageClient disableEditor={disableEdit} className={styles.logo} cmsImage={company.logo} width={logoWidth} /> : 
                <CmsImage disableEditor={disableEdit} className={styles.logo} cmsImage={company.logo} width={logoWidth} />
            }
            <div className={styles.info}>
                <h2>{company.name}</h2>
                <p>{company.description}</p>
                {
                    !disableEdit && (canUpdate.authorized || canDestroy.authorized) ? (
                        <SettingsHeaderItemPopUp showButtonClass={styles.showSettings} PopUpKey={`Edit ${company.id}`}>
                            <Form
                                title="Rediger Bedrift"
                                action={updateComanyAction.bind(null, { id: company.id })}
                                refreshOnSuccess
                                closePopUpOnSuccess={`Edit ${company.id}`}
                                submitText="Lagre"
                            >
                                <TextInput name="name" label="Navn" defaultValue={company.name} />
                                <TextInput name="description" label="Beskrivelse" defaultValue={company.description} />
                            </Form>
                            <Form 
                                action={destroyCompanyAction.bind(null, { id: company.id })}
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
