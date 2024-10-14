import styles from './page.module.scss'
import UserSelectionProvider from '@/contexts/UserSelection'
import UserPagingProvider from '@/contexts/paging/UserPaging'
import CreateDotForm from './CreateDotForm'
import PopUpProvider from '@/contexts/PopUp'
import DotPagingProvider from '@/contexts/paging/DotPaging'
import DotList from './DotList'

export default async function Dots() {
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
                    details={{ userId: null, onlyActive: false }}
                >
                    <DotList />
                </DotPagingProvider>
            </main>
        </div>
    )
}
