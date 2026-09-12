import { DateInput } from '@ohma/ui'

export const Default = () => (
    <div style={{ maxWidth: '22rem' }}>
        <DateInput name="eventDate" label="Dato" defaultValue={new Date('2026-08-15T18:00:00Z')} />
    </div>
)

export const WithTime = () => (
    <div style={{ maxWidth: '22rem' }}>
        <DateInput
            name="eventStart"
            label="Starttid"
            includeTime
            defaultValue={new Date('2026-08-15T18:00:00Z')}
        />
    </div>
)

export const Empty = () => (
    <div style={{ maxWidth: '22rem' }}>
        <DateInput name="deadline" label="Søknadsfrist" />
    </div>
)
