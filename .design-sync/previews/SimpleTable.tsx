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

const Name = ({ children }: { children: string }) => <strong>{children}</strong>

const Status = ({ children, color }: { children: string, color: string }) => (
    <span style={{ color: `var(--accent-${color})` }}>{children}</span>
)

export const RichCells = () => (
    <SimpleTable
        header={['Verv', 'Person', 'Status']}
        body={[
            ['Leder', <Name key="a">Ingrid Solberg</Name>, <Status key="b" color="green">Aktiv</Status>],
            ['Nestleder', <Name key="c">Jonas Halvorsen</Name>, <Status key="d" color="green">Aktiv</Status>],
            ['Økonomiansvarlig', <Name key="e">Maren Lie</Name>, <Status key="f" color="yellow">Permisjon</Status>],
        ]}
    />
)
