export enum ThemeName {
    Standard = 'Standard',
    Light = 'Light',
    Solarized = 'Solarized',
    StjerneInnbygger = 'StjerneInnbygger',
}

type ThemeColors = {
    primary: string;
    secondary: string;
    layer: string;
    text: string;
    textMuted: string;
};

export const themes: Record<ThemeName, ThemeColors> = {
    [ThemeName.Standard]: {
        primary: 'hsl(210, 70%, 50%)',
        secondary: 'hsl(210, 5%, 12%)',
        layer: 'hsla(210, 0%, 0%, 0.2)',
        text: 'hsl(0, 0%, 80%)',
        textMuted: 'hsl(0, 0%, 70%)',
    },
    [ThemeName.Light]: {
        primary: 'hsl(210, 98%, 50%)',
        secondary: 'hsl(210, 18%, 95%)',
        layer: 'hsla(0, 0%, 0%, 0.05)',
        text: 'hsl(0, 0%, 10%)',
        textMuted: 'hsl(0, 0%, 20%)',
    },
    [ThemeName.Solarized]: {
        primary: 'hsl(210, 98%, 50%)',
        secondary: 'hsl(44, 87%, 94%)',
        layer: 'hsla(0, 0%, 50%, 0.15)',
        text: 'hsl(196, 13%, 45%)',
        textMuted: 'hsl(180, 7%, 60%)',
    },
    [ThemeName.StjerneInnbygger]: {
        primary: 'hsl(207, 91%, 65%)',
        secondary: 'hsl(202, 64%, 10%)',
        layer: 'hsla(211, 48.1%, 35.5%, 0.18)',
        text: 'hsl(0, 0%, 80%)',
        textMuted: 'hsl(0, 0%, 70%)',
    },
}

export function applyTheme(name: ThemeName): void {
    localStorage.setItem('theme', name)
    const colors = themes[name]
    const root = document.documentElement
    Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
    })
}
