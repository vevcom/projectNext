'use client'

import styles from './page.module.scss'
import { themes, applyTheme } from './theme'
import { useEffect, useState } from 'react'
import type { ThemeName } from './theme'

export default function ThemeForm() {
    const [activeTheme, setActiveTheme] = useState<ThemeName | null>(null)

    useEffect(() => {
        setActiveTheme(localStorage.getItem('theme') as ThemeName | null)
    }, [])

    function selectTheme(name: ThemeName) {
        applyTheme(name)
        setActiveTheme(name)
    }

    return (
        <div className={styles.ThemeWrapper}>
            {Object.entries(themes).map(([name, colors]) => (
                <a
                    key={name}
                    className={`${styles.Theme} ${name === activeTheme ? styles.active : ''}`}
                    onClick={() => selectTheme(name as ThemeName)}
                >
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
