import styles from './page.module.scss'

import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readGroupsAction } from '@/services/groups/actions'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Link from 'next/link'

export default async function navnquiz() {
    const groups = unwrapActionReturn(await readGroupsAction())

    return <PageWrapper title="Navnquiz">

        <div className = {styles.link}>
            <ul>
                {groups.map((group) =>
                    <li key={group.id}>
                        <Link href={`/navnquiz/${group.id}`}>{group.id}</Link>
                    </li>
                )}
            </ul>
        </div>

    </PageWrapper>
}

