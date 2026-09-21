'use client'

import styles from './page.module.scss'
import { themes, applyTheme, ThemeName } from './theme'

export default function ThemeForm() {
    return (
        <div className={styles.ThemeWrapper}>
            {Object.values(ThemeName).map(themeName => (
                <a key={themeName} className={styles.Theme} onClick={() => applyTheme(themeName)}>
                    <div className={styles.ThemeHeader}>
                        {themeName}
                    </div>
                    <div className={styles.ThemeBody}>
                        {Object.entries(themes[themeName]).map(([key, value]) => (
                            <div
                                key={key}
                                className={styles.ColorSwatch}
                                style={{ backgroundColor: value }}
                                title={`${key}: ${value}`}
                            />
                        ))}
                    </div>
                </a>
            ))}
        </div>
    )
}
