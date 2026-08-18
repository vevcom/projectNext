import { BorderButton } from '@ohma/ui'

/**
 * Outline counterpart to Button, used for secondary/additive actions in the CMS.
 * Note: BorderButton ships no `:disabled` styling, so a disabled instance is
 * visually identical to an enabled one — see NOTES.md.
 */
export const Colors = () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <BorderButton color="primary">Legg til seksjon</BorderButton>
        <BorderButton color="secondary">Avbryt</BorderButton>
    </div>
)

export const InlineWithText = () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)' }}>Ingen deler ennå.</span>
        <BorderButton color="primary">Legg til del</BorderButton>
    </div>
)

export const Stacked = () => (
    <div style={{ display: 'grid', gap: '0.5rem', justifyItems: 'start' }}>
        <BorderButton color="primary">Legg til avsnitt</BorderButton>
        <BorderButton color="primary">Legg til bilde</BorderButton>
        <BorderButton color="primary">Legg til lenke</BorderButton>
    </div>
)
