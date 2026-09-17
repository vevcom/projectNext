import { SearchableDropdown } from '@ohma/ui'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const members = [
    { value: 'olanord', label: 'Ola Nordmann', key: 'olanord' },
    { value: 'ingrids', label: 'Ingrid Solberg', key: 'ingrids' },
    { value: 'jonash', label: 'Jonas Halvorsen', key: 'jonash' },
    { value: 'marenl', label: 'Maren Lie', key: 'marenl' },
    { value: 'sofiek', label: 'Sofie Kristiansen', key: 'sofiek' },
]

/** The panel opens on input focus, so focusing the real field is what shows it. */
function FocusOnMount({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        ref.current?.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus()
    }, [])
    return <div ref={ref}>{children}</div>
}

export const Closed = () => (
    <div style={{ maxWidth: '22rem' }}>
        <SearchableDropdown name="member" label="Søk etter medlem" options={members} />
    </div>
)

export const WithSelection = () => (
    <div style={{ maxWidth: '22rem' }}>
        <SearchableDropdown name="memberSelected" label="Medlem" defaultValue="ingrids" options={members} />
    </div>
)

export const Opened = () => (
    <FocusOnMount>
        <div style={{ maxWidth: '22rem' }}>
            <SearchableDropdown name="memberOpen" label="Søk etter medlem" defaultValue="jonash" options={members} />
        </div>
    </FocusOnMount>
)
