import { ColorInput } from '@ohma/ui'

export const Default = () => (
    <ColorInput name="groupColor" label="Komitéfarge" defaultValue="#037FFC" />
)

export const FromRGB = () => (
    <ColorInput name="accent" label="Aksentfarge" defaultValueRGB={{ red: 92, green: 209, blue: 122 }} />
)

export const Palette = () => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
        <ColorInput name="primary" label="Primær" defaultValue="#037FFC" />
        <ColorInput name="warning" label="Advarsel" defaultValue="#e6e64d" />
        <ColorInput name="danger" label="Fare" defaultValue="#eb5757" />
    </div>
)
