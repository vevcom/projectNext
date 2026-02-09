'use client'

import styles from './page.module.scss'

export default function ThemeForm() {
    type ThemeColors = Record<string, string>;
    interface Theme {
        name: string;
        colors: ThemeColors;
    }

    function applyTheme(theme: Theme): void {
        const root = document.documentElement

        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value)
        })
    }

    const themes: Theme[] = [
        {
            name: 'Standard',
            colors: {
                primary: 'hsl(210, 70%, 50%)',
                secondary: 'hsl(210, 5%, 12%)',
                layer: 'hsl(210, 0%, 0%, 20%)',
                text: 'hsl(0, 0%, 80%)',
                textMuted: 'hsl(0, 0%, 70%)',
            },
        },
        {
            name: 'Light',
            colors: {
                primary: 'hsl(210, 98%, 50%)',
                secondary: 'hsl(210, 18%, 95%)',
                layer: 'hsl(0, 0%, 0%, 5%)',
                text: 'hsl(0, 0%, 10%)',
                textMuted: 'hsl(0, 0%, 20%)',
            },
        },
        {
            name: 'Solarized',
            colors: {
                primary: 'hsl(210, 98%, 50%)',
                secondary: 'hsl(44, 87%, 94%)',
                layer: 'hsl(0, 0%, 50%, 15%)',
                text: 'hsl(196, 13%, 45%)',
                textMuted: 'hsl(180, 7%, 60%)',
            },
        },
        {
            name: 'Forest',
            colors: {
                primary: '#166534',
                secondary: '#8eb184',
                layer: 'hsla(207, 0%, 30%, 0.3)',
                text: '#2f332f',
                textMuted: '#424a45',
            },
        },
        {
            name: 'Stjerne innbygger',
            colors: {
                primary: 'hsl(207, 91%, 65%)',
                secondary: 'hsl(202, 64%, 10%)',
                layer: 'hsla(211, 48.1%, 35.5%, 0.18)',
                text: 'hsl(0, 0%, 80%)',
                textMuted: 'hsl(0, 0%, 70%)',
            },
        },
        {
            name: 'Polaris',
            colors: {
                primary: 'hsl(229,71%,53%)',
                secondary: 'hsl(202,19%,20%)',
                layer: 'hsla(226,67%,36%,0.34)',
                text: 'hsl(0, 0%, 80%)',
                textMuted: 'hsl(0, 0%, 70%)',
            },
        },
        {
            name: 'Aegis',
            colors: {
                primary: 'hsl(0,89%,52%)',
                secondary: 'hsl(0,2%,10%)',
                layer: 'hsla(0,2%,59%,0.1)',
                text: 'hsl(0, 0%, 80%)',
                textMuted: 'hsl(0, 0%, 70%)',
            },
        },
        {
            name: 'Origin',
            colors: {
                primary: 'hsl(0,0%,100%)',
                secondary: 'hsl(0,0%,100%)',
                layer: 'hsla(0,0%,39%,0.1)',
                text: 'hsl(0,0%,0%)',
                textMuted: 'hsl(0,0%,20%)',
            },
        },
        {
            name: 'Old timer',
            colors: {
                primary: 'hsl(50,100%,52%)',
                secondary: 'hsl(220,23%,97%)',
                layer: 'hsl(0, 0%, 12%)',
                text: 'hsl(0,0%,87%)',
                textMuted: 'hsl(0,0%,64%)',
            },
        },
        {
            name: 'Dragonlore',
            colors: {
                primary: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                secondary: 'hsl(210, 5%, 12%)',
                layer: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                text: 'hsl(0,0%,10%)',
                textMuted: 'hsl(0,0%,20%)',
            },
        },
    ]

    return (
        <div className={styles.ThemeWrapper}>
            {themes.map((theme) => (
                <a key={theme.name} className={styles.Theme} onClick={() => applyTheme(theme)}>
                    <div className={styles.ThemeHeader}>
                        {theme.name}
                    </div>

                    <div className={styles.ThemeBody}>
                        {Object.entries(theme.colors).map(([key, value]) => (
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
