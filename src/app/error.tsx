'use client'
import styles from './error.module.scss'
import Button from '@/components/UI/Button'
import SpecialCmsImageClient from '@/components/Cms/CmsImage/SpecialCmsImageClient'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import { frontpageAuth } from '@/services/frontpage/auth'
import { useSession } from '@/auth/session/useSession'
import { Session } from '@/auth/session/Session'
import PageTitleSetter from '@/contexts/PageTitleSetter'

/**
 * note that passing custom error type to next error boundary is not supported
 * thus the error is encoded in a normal Error object
 * Look at redirectToErrorPage to how it is implemented.
*/
export default function ErrorBoundary({ error, reset }: {error: unknown, reset: () => void}) {
    const session = useSession()

    return (
        <div className={styles.wrapper}>
            <PageTitleSetter title={'Error'} />
            <div className={styles.info}>
                <div className={styles.imageContainer}>
                    <SpecialCmsImageClient
                        canEdit={
                            frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
                                session.loading ? Session.empty() : session.session
                            ).toJsObject()
                        }
                        width={70}
                        special="SERVER_ERROR"
                        //TODO: Probably call through other service see comments in frontpage operations
                        //Makes little sense that frontpage ownes this.
                        readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                        updateCmsImageAction={updateSpecialCmsImageFrontpage}
                    />
                </div>
                {
                    error instanceof Error ? (
                        <h3>{error.message}</h3>
                    ) : (
                        <h3>Ukjent feil</h3>
                    )
                }
            </div>
            <Button onClick={reset}>Prøv igjen</Button>
        </div>
    )
}
