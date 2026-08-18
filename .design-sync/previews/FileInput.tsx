import { FileInput } from '@ohma/ui'

export const Primary = () => (
    <FileInput name="avatar" label="Velg profilbilde" color="primary" accept="image/*" />
)

/**
 * `black` is the component's default but pairs --colors-black with
 * --text-inv (dark on black), so its label is unreadable on any surface.
 * Shown here deliberately; see NOTES.md.
 */
export const Colors = () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
        <FileInput name="primary" label="Last opp (primary)" color="primary" />
        <FileInput name="secondary" label="Last opp (secondary)" color="secondary" />
        <FileInput name="red" label="Last opp (red)" color="red" />
        <FileInput name="black" label="Last opp (black — default)" color="black" />
    </div>
)

export const Disabled = () => (
    <FileInput name="report" label="Last opp rapport" color="primary" disabled />
)
