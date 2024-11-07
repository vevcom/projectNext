import styles from './Theme.module.scss'
import Form from '../Form/Form'
import { destroyThemeAction } from '@/actions/themes/destroy'
import React from 'react'
import type { Theme as ThemeT } from '@prisma/client'


type PropTypes = {
  theme: ThemeT
}

export default function Theme({
    theme,
}: PropTypes) {
    return (
        <div
            className={styles.themeList}
            style={{
                '--primaryLight': `rgb(${theme.primaryLightR}, ${theme.primaryLightG}, ${theme.primaryLightB})`,
                '--primaryDark': `rgb(${theme.primaryDarkR}, ${theme.primaryDarkG}, ${theme.primaryDarkB})`,
                '--secondaryLight': `rgb(${theme.secondaryLightR}, ${theme.secondaryLightG}, ${theme.secondaryLightB})`,
                '--secondaryDark': `rgb(${theme.secondaryDarkR}, ${theme.secondaryDarkG}, ${theme.secondaryDarkB})`
            } as React.CSSProperties}
        >
            <span className="styles.themeName">{theme.id}</span>
            <div className={styles.buttonGroup}>
                <Form action={destroyThemeAction.bind(null, { id: theme.id })} />
            </div>
        </div>
    )
}
