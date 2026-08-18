import { NavBarItem } from '@ohma/ui'

export const Default = () => <NavBarItem href="/events" name="Hvad der hender" />

export const Row = () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <NavBarItem href="/events" name="Hvad der hender" />
        <NavBarItem href="/news" name="Nyheter" />
        <NavBarItem href="/committees" name="Komitéer" />
        <NavBarItem href="/omegaquotes" name="Omegaquotes" />
    </div>
)

export const LongLabel = () => (
    <NavBarItem href="/articles/om%20omega" name="Om Sanctus Omega Broderskab" />
)
