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
                    <div className={styles.ThemeContent}>
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
                        <div
                            className={styles.ThemePreview}
                            style={{
                                background: 'linear-gradient(125deg, '
                                    + `color-mix(in srgb, ${colors['accent-blue']}, transparent 70%) 0%, `
                                    + `color-mix(in srgb, ${colors['surface-base']}, transparent 80%) 70%), `
                                    + colors['surface-raised'],
                            }}
                        >
                            <div className={styles.PreviewNavBar} style={{ backgroundColor: colors['surface-base'] }}>
                                <span className={styles.PreviewLogo} style={{ backgroundColor: colors['accent-blue'] }} />
                                <span className={styles.PreviewTitle} style={{ backgroundColor: colors['text-muted'] }} />
                                <span className={styles.PreviewNavGrower} />
                                <span className={styles.PreviewNavIcon} style={{ backgroundColor: colors['text-muted'] }} />
                                <span className={styles.PreviewNavIcon} style={{ backgroundColor: colors['accent-blue'] }} />
                            </div>
                            <div className={styles.PreviewBody}>
                                <div className={styles.PreviewSideBar} style={{ backgroundColor: colors['surface-base'] }}>
                                    <span className={styles.PreviewSideIcon} style={{ backgroundColor: colors['accent-blue'] }} />
                                    <span className={styles.PreviewSideIcon} style={{ backgroundColor: colors['text-muted'] }} />
                                    <span className={styles.PreviewSideIcon} style={{ backgroundColor: colors['text-muted'] }} />
                                    <span className={styles.PreviewSideIcon} style={{ backgroundColor: colors['text-muted'] }} />
                                </div>
                                <div className={styles.PreviewCard} style={{ backgroundColor: colors['surface-base'] }}>
                                    <span className={styles.PreviewHeading} style={{ backgroundColor: colors['ink-strong'] }} />
                                    <span className={styles.PreviewText} style={{ backgroundColor: colors['text-muted'] }} />
                                    <span className={styles.PreviewText} style={{ backgroundColor: colors['text-muted'] }} />
                                    <span className={styles.PreviewButton} style={{ backgroundColor: colors['accent-blue'] }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    )
}
