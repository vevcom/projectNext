import { createCompanyAction } from '@/actions/career/companies/create';
import Form from '@/components/Form/Form';
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp';
import TextInput from '@/components/UI/TextInput';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import CompanyPagingProvider, { PageSizeCompany } from '@/contexts/paging/CompanyPaging';
import { SearchParamsServerSide } from '@/lib/query-params/Types';
import { readCompanyPageAction } from '@/actions/career/companies/read';
import CompanyList from '@/app/_components/Company/CompanyList';
import { companyListRenderer } from '@/app/_components/Company/CompanyListRenderer';
import { QueryParams } from '@/lib/query-params/queryParams';

type PropTypes = SearchParamsServerSide

export default async function page({ searchParams }: PropTypes) {
    const pageSize = 10 satisfies PageSizeCompany
    const name = QueryParams.companyName.decode(searchParams) ?? undefined
    const res = await readCompanyPageAction.bind(null, { 
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
                    action={createCompanyAction.bind(null, {})}
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
                <CompanyList serverRenderedData={serverRenderedData.map(companyListRenderer(false))} />
            </CompanyPagingProvider>
        </PageWrapper>
    )
}
