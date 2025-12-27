import styles from './page.module.scss'
import { QueryParams } from '@/lib/queryParams/queryParams'
import LoggedInLandingPage from './LoggedIn'
import LoggedOutLandingPage from './LoggedOut'
import { ServerSession } from '@/auth/session/ServerSession'
import type { SearchParamsServerSide } from '@/lib/queryParams/types'
import { frontpageAuth } from '@/services/frontpage/auth'
import Link from 'next/link'

type PropTypes = SearchParamsServerSide

export default async function Home({ searchParams }: PropTypes) {
    const session = await ServerSession.fromNextAuth()
    if (!session.user) {
        return <LoggedOutLandingPage />
    }
    const frontpageVersion = QueryParams.frontpageVersion.decode(await searchParams)
    const canEditFrontpage = 
        frontpageAuth.updateSpecialCmsParagraphContentSection.dynamicFields({}).auth(
            session
        ).authorized
        || frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
            session
        ).authorized
    switch (frontpageVersion) {
        case 'logged-out':
            return (
                <>
                    <Link 
                        className={styles.link}
                        href={`/?${QueryParams.frontpageVersion.encodeUrl('logged-in')}`}
                    >
                        <span>Gå til innlogget forside</span>
                    </Link>
                    <LoggedOutLandingPage />
                </>
            )
        case 'logged-in':
        default:
            return (
                <> {
                    canEditFrontpage && (
                        <Link
                            className={styles.link}
                            href={`/?${QueryParams.frontpageVersion.encodeUrl('logged-out')}`}
                        >
                            <span>Gå til utlogget forside</span>
                        </Link>
                    )
                }
                    <LoggedInLandingPage />
                </>
            )
    }
}
