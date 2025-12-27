import { ServerSession } from '@/auth/session/ServerSession'
import styles from './layout.module.scss'
import SpecialCmsImage from '@/components/Cms/CmsImage/SpecialCmsImage'
import { readSpecialCmsImageFrontpage, updateSpecialCmsImageFrontpage } from '@/services/frontpage/actions'
import React from 'react'
import { frontpageAuth } from '@/services/frontpage/auth'

type PropTypes = {
    children: React.ReactNode
}

export default async function AuthLayout({ children }: PropTypes) {
    const session = await ServerSession.fromNextAuth()
    const canEditAuthIcon = frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
        session
    ).toJsObject()

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.input}>
                    {children}
                </div>
                <div className={styles.image}>
                    <SpecialCmsImage
                        canEdit={canEditAuthIcon}
                        special="AUTH_ICON"
                        alt="en kappemann sin hatt"
                        width={200}
                        //TODO: Probably call through other service see comments in frontpage operations
                        readSpecialCmsImageAction={readSpecialCmsImageFrontpage}
                        updateCmsImageAction={updateSpecialCmsImageFrontpage}
                    />
                </div>
            </div>
        </div>
    )
}
