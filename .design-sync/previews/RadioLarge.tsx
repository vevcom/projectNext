import { RadioLarge } from '@ohma/ui'

export const Default = () => (
    <RadioLarge
        name="attendance"
        defaultValue="yes"
        options={[
            { value: 'yes', label: 'Kommer' },
            { value: 'maybe', label: 'Kanskje' },
            { value: 'no', label: 'Kommer ikke' },
        ]}
    />
)

export const NumericValues = () => (
    <RadioLarge
        name="guests"
        defaultValue={1}
        options={[
            { value: 0, label: 'Ingen følge' },
            { value: 1, label: 'Én med følge' },
            { value: 2, label: 'To med følge' },
        ]}
    />
)

export const ManyOptions = () => (
    <RadioLarge
        name="committee"
        defaultValue="vevkom"
        options={[
            { value: 'vevkom', label: 'Vevkom' },
            { value: 'arrkom', label: 'Arrkom' },
            { value: 'kjellerkom', label: 'Kjellerkom' },
            { value: 'redaksjonen', label: 'Redaksjonen' },
        ]}
    />
)
