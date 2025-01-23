import styles from './Theme.module.scss'
import Form from '../Form/Form'
import { destroyThemeAction } from '@/actions/themes/destroy'
import React from 'react'
import type { Theme as ThemeT } from '@prisma/client'
import { generateSCSSVariables } from '@/lib/themes/GenerateSCSSVariables'
import { updateThemeAction } from '@/actions/themes/update'


type PropTypes = {
  theme: ThemeT
}

export default function Theme({
    theme,
}: PropTypes) {
    return (
        <div
            className={styles.themeList}
            style={generateSCSSVariables(theme)}
        >
            <h2>{theme.name}</h2>
            <div className={styles.primary}>
                <div className={styles.light}>
                    <div/><div/><div/>
                </div>
                <div className={styles.dark}>
                    <div/><div/><div/>
                </div>
            </div>
            <div className={styles.secondary}>
                <div className={styles.light}>
                    <div/><div/><div/>
                </div>
                <div className={styles.dark}>
                    <div/><div/><div/>
                </div>
            </div>
            <div className={styles.buttonGroup}>
                <Form 
                    action={updateThemeAction.bind(null, { id: theme.id })} 
                    refreshOnSuccess
                    submitText='Edit'
                    submitColor="secondary"
                    confirmation={{confirm: false}}
                />
                <Form 
                    action={destroyThemeAction.bind(null, { id: theme.id })} 
                    refreshOnSuccess
                    submitText='Slett'
                    submitColor="red"
                    confirmation={{confirm: true, text: "Er du sikker?"}}
                />
            </div>
        </div>
    )
}
