'use client'

import { applyTheme, themes } from '@/app/users/[username]/(user-admin)/theme/theme'
import { useEffect } from 'react'
import type { ThemeName } from '@/app/users/[username]/(user-admin)/theme/theme'

export default function ThemeEnabler() {
    useEffect(() => {
        const saved = localStorage.getItem('theme') as ThemeName
        if (saved && themes[saved]) {
            applyTheme(saved)
        }
    }, [])
    return null
}
