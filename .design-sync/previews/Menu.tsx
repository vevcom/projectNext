import { Menu } from '@ohma/ui'
import { useEffect, useRef } from 'react'
import {
    faBeer, faBook, faCalendar, faCamera, faComment, faNewspaper, faSuitcase,
} from '@fortawesome/free-solid-svg-icons'
import type { ReactNode } from 'react'

const items = [
    { name: 'Komitéer', href: '/committees', show: 'all' as const, icon: faBeer },
    { name: 'Hvad der hender', href: '/events', show: 'all' as const, icon: faCalendar },
    { name: 'Ombul', href: '/ombul', show: 'all' as const, icon: faBook },
    { name: 'Nyheter', href: '/news', show: 'all' as const, icon: faNewspaper },
    { name: 'Bilder', href: '/image-collections', show: 'all' as const, icon: faCamera },
    { name: 'Omegaquotes', href: '/omegaquotes', show: 'loggedIn' as const, icon: faComment },
    { name: 'Karriere', href: '/career', show: 'loggedIn' as const, icon: faSuitcase },
]

/** Menu owns `isOpen`; the panel is only reachable by pressing the real trigger. */
function OpenOnMount({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        ref.current?.querySelector<HTMLButtonElement>('button')?.click()
    }, [])
    return <div ref={ref}>{children}</div>
}

export const MobileTrigger = () => (
    <Menu items={items} openBtnVariant="mobile" />
)

export const DesktopTrigger = () => (
    <Menu items={items} openBtnVariant="desktop" />
)

export const Opened = () => (
    <OpenOnMount>
        <Menu items={items} openBtnVariant="desktop" />
    </OpenOnMount>
)
