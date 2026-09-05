import { DateDisplay } from '@ohma/ui'

// Fixed dates so the cards are reproducible. DateDisplay renders the UTC string
// on the server pass and switches to the viewer's locale after hydration.
const BALL = new Date('2026-08-15T18:00:00Z')
const DEADLINE = new Date('2026-09-01T23:59:00Z')

export const WithTime = () => <DateDisplay date={BALL} />

export const DateOnly = () => <DateDisplay date={BALL} includeTime={false} />

export const InSentence = () => (
    <p style={{ margin: 0 }}>
        Påmeldingen stenger <strong><DateDisplay date={DEADLINE} /></strong>.
    </p>
)

export const InList = () => (
    <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.35rem' }}>
        <li>Immatrikuleringsball — <DateDisplay date={BALL} /></li>
        <li>Vinsmaking — <DateDisplay date={new Date('2026-09-03T19:00:00Z')} /></li>
        <li>Ombul-lansering — <DateDisplay date={new Date('2026-09-21T17:30:00Z')} /></li>
    </ul>
)
