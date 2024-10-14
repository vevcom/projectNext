import styles from './page.module.scss'
import UserSelectionProvider from '@/contexts/UserSelection'
import UserPagingProvider from '@/contexts/paging/UserPaging'
import CreateDotForm from './CreateDotForm'
import PopUpProvider from '@/contexts/PopUp'
import DotPagingProvider from '@/contexts/paging/DotPaging'
import DotList from './DotList'
import { SearchParamsServerSide } from '@/lib/query-params/Types'
import { QueryParams } from '@/lib/query-params/queryParams'

type PropTypes = SearchParamsServerSide

export default async function Dots({ searchParams }: PropTypes) {
    const onlyActive = QueryParams.onlyActive.decode(searchParams) ?? false
    const userId = QueryParams.userId.decode(searchParams)

    return (
        <div className={styles.wrapper}>
            <h1>Prikker</h1>
            <div className={styles.createNew}>
                <UserSelectionProvider>
                    <UserPagingProvider 
                        startPage={{ page: 0, pageSize: 50 }} 
                        serverRenderedData={[]} 
                        details={{ partOfName: '', groups: [] }}
                    >
                        <PopUpProvider>
                            <CreateDotForm />
                        </PopUpProvider>
                    </UserPagingProvider>
                </UserSelectionProvider>
            </div>
            <main>
                <DotPagingProvider 
                    startPage={{ page: 0, pageSize: 30 }} 
                    serverRenderedData={[]} 
                    details={{ userId, onlyActive }}
                >
                    <UserSelectionProvider>
                        <UserPagingProvider 
                            startPage={{ page: 0, pageSize: 50 }} 
                            serverRenderedData={[]} 
                            details={{ partOfName: '', groups: [] }}
                        >
                            <PopUpProvider>
                                <DotList onlyActive={onlyActive} />
                            </PopUpProvider>
                        </UserPagingProvider>
                    </UserSelectionProvider>
                </DotPagingProvider>
            </main>
        </div>
    )
}
