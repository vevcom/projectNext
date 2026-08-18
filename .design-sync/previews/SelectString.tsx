import { SelectString } from '@ohma/ui'

export const Default = () => (
    <div style={{ maxWidth: '22rem' }}>
        <SelectString
            name="committee"
            label="Komité"
            defaultValue="vevkom"
            options={[
                { value: 'vevkom', label: 'Vevkom', key: 'vevkom' },
                { value: 'arrkom', label: 'Arrkom', key: 'arrkom' },
                { value: 'kjellerkom', label: 'Kjellerkom', key: 'kjellerkom' },
                { value: 'redaksjonen', label: 'Redaksjonen', key: 'redaksjonen' },
            ]}
        />
    </div>
)

export const LabelFromValue = () => (
    <div style={{ maxWidth: '22rem' }}>
        <SelectString
            name="status"
            label="Status"
            options={[
                { value: 'Aktiv', key: 'aktiv' },
                { value: 'Permisjon', key: 'permisjon' },
                { value: 'Utflyttet', key: 'utflyttet' },
            ]}
        />
    </div>
)

export const Disabled = () => (
    <div style={{ maxWidth: '22rem' }}>
        <SelectString
            name="locked"
            label="Opptaksår"
            defaultValue="2021"
            disabled
            options={[{ value: '2021', key: '2021' }, { value: '2022', key: '2022' }]}
        />
    </div>
)
