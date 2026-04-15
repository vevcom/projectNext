'use client'

import styles from './page.module.scss'
import { themes, applyTheme } from './theme'
import type { ThemeName } from './theme'

export default function ThemeForm() {
    return (
        <div className={styles.ThemeWrapper}>
            {Object.entries(themes).map(([name, colors]) => (
                <a key={name} className={styles.Theme} onClick={() => applyTheme(name as ThemeName)}>
                    <div className={styles.ThemeHeader}>
                        {name}
                    </div>
                    <div className={styles.ThemeBody}>
                        {Object.entries(colors).map(([key, value]) => (
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
