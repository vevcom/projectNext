import { SimpleTable } from '@ohma/ui'

export const Default = () => (
    <SimpleTable
        header={['Navn', 'Komité', 'Opptaksår']}
        body={[
            ['Ola Nordmann', 'Vevkom', '2021'],
            ['Ingrid Solberg', 'Arrkom', '2022'],
            ['Jonas Halvorsen', 'Redaksjonen', '2020'],
            ['Maren Lie', 'Kjellerkom', '2023'],
        ]}
    />
)

// NOTE: the `links` prop is deliberately not shown. SimpleTable wraps each
// <tr> in a <Link>, i.e. an <a> containing a <tr>, which is invalid HTML — the
// browser hoists the anchor out of the table and the rows visibly break apart.
// That is a bug in the component, not in this preview; see NOTES.md.

export const RichCells = () => (
    <SimpleTable
        header={['Verv', 'Person', 'Status']}
        body={[
            ['Leder', <strong key="a">Ingrid Solberg</strong>, <span key="b" style={{ color: 'var(--accent-green)' }}>Aktiv</span>],
            ['Nestleder', <strong key="c">Jonas Halvorsen</strong>, <span key="d" style={{ color: 'var(--accent-green)' }}>Aktiv</span>],
            ['Økonomiansvarlig', <strong key="e">Maren Lie</strong>, <span key="f" style={{ color: 'var(--accent-yellow)' }}>Permisjon</span>],
        ]}
    />
)
