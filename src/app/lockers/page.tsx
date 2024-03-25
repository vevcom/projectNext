import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import LockerList from './LockerList'
import Form from '../components/Form/Form'
import NumberInput from '../components/UI/NumberInput'
import { createLockerResorvation } from '@/actions/lockers/reservations/create'
import LockerPagingProvider from '@/context/paging/LockerPaging'

export default async function Lockers() {
    return (
        <PageWrapper title="Skapreservasjon">
            <Form
                title="Reserver skap"
                submitText="Reserver skap"
                action={createLockerResorvation}
            >
                <NumberInput name="lockerId" label="Skap nr."></NumberInput>
                <NumberInput name="userId" label="userId"></NumberInput>
            </Form>
            <LockerPagingProvider
                    startPage={{
                        pageSize: 20,
                        page: 0
                    }}
                    details={undefined}
                    serverRenderedData={[]}
                >
                    <LockerList />
            </LockerPagingProvider>
        </PageWrapper>
    )
}