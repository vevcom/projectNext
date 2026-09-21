import { Dropdown } from '@ohma/ui'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const committees = [
    { value: 'vevkom', label: 'Vevkom', key: 'vevkom' },
    { value: 'arrkom', label: 'Arrkom', key: 'arrkom' },
    { value: 'kjellerkom', label: 'Kjellerkom', key: 'kjellerkom' },
    { value: 'redaksjonen', label: 'Redaksjonen', key: 'redaksjonen' },
]

/** Dropdown owns its `open` state, so the panel is only reachable by clicking the real trigger. */
function ClickTriggerOnMount({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        ref.current?.querySelector<HTMLButtonElement>('button')?.click()
    }, [])
    return <div ref={ref}>{children}</div>
}

export const Closed = () => (
    <div style={{ maxWidth: '22rem' }}>
        <Dropdown name="committee" label="Komité" options={committees} />
    </div>
)

export const WithSelection = () => (
    <div style={{ maxWidth: '22rem' }}>
        <Dropdown name="committeeSelected" label="Komité" defaultValue="arrkom" options={committees} />
    </div>
)

export const Opened = () => (
    <ClickTriggerOnMount>
        <div style={{ maxWidth: '22rem' }}>
            <Dropdown name="committeeOpen" label="Komité" defaultValue="kjellerkom" options={committees} />
        </div>
    </ClickTriggerOnMount>
)

export const Disabled = () => (
    <div style={{ maxWidth: '22rem' }}>
        <Dropdown name="committeeDisabled" label="Komité" options={committees} disabled />
    </div>
)
