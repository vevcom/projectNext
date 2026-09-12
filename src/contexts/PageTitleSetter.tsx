'use client'

import { usePageTitle } from './PageTitle'
import { useEffect } from 'react'

export default function PageTitleSetter({ title }: { title: string }) {
    const { setTitle } = usePageTitle()
    useEffect(() => {
        setTitle(title)
        return () => setTitle('')
    }, [title, setTitle])
    return null
}
