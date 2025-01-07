import { createCompanyAction } from '@/actions/career/companies/create'
import Form from '@/components/Form/Form'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'
import TextInput from '@/components/UI/TextInput'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import CompanyPagingProvider from '@/contexts/paging/CompanyPaging'
import { readCompanyPageAction } from '@/actions/career/companies/read'
import CompanyList from '@/components/Company/CompanyList'
import { companyListRenderer } from '@/components/Company/CompanyListRenderer'
import { QueryParams } from '@/lib/query-params/queryParams'
import CompanyListFilter from '@/app/_components/Company/CompanyListFilter'
import { Session } from '@/auth/Session'
import { bindParams } from '@/actions/bindParams'
import type { SearchParamsServerSide } from '@/lib/query-params/Types'
import type { PageSizeCompany } from '@/contexts/paging/CompanyPaging'

type PropTypes = SearchParamsServerSide

export default async function page({ searchParams }: PropTypes) {
    const pageSize = 10 satisfies PageSizeCompany
    const name = QueryParams.companyName.decode(searchParams) ?? undefined
    // TODO: Decide how getting session in pages should be done. Are we going away form useUser/getUser?
    const session = await Session.fromNextAuth()
    const res = await bindParams(readCompanyPageAction, {
        paging: {
            page: {
                page: 0,
                pageSize,
                cursor: null
            },
            details: {
                name
            },
        }
    })()
    const serverRenderedData = res.success ? res.data : []

    return (
        <PageWrapper title="Bedrifter" headerItem={
            <AddHeaderItemPopUp PopUpKey="CreateCompany">
                <Form
                    title="Ny bedrift"
                    action={bindParams(createCompanyAction, undefined)}
                    refreshOnSuccess
                    closePopUpOnSuccess="CreateCompany"
                    submitText="Lag"
                >
                    <TextInput name="name" label="Navn" />
                    <TextInput name="description" label="Beskrivelse" />
                </Form>
            </AddHeaderItemPopUp>
        }>
            <CompanyPagingProvider
                serverRenderedData={serverRenderedData}
                startPage={{
                    page: 1,
                    pageSize
                }}
                details={{
                    name
                }}
            >
                <CompanyListFilter currentName={name ?? ''} />
                <CompanyList serverRenderedData={serverRenderedData.map(
                    companyListRenderer({
                        session,
                        asClient: false,
                    })
                )} />
            </CompanyPagingProvider>
        </PageWrapper>
    )
}
