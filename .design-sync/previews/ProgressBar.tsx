import { ProgressBar } from '@ohma/ui'

export const Steps = () => (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
        <div>
            <p style={{ margin: '0 0 0.4rem', color: 'var(--text-muted)' }}>Tom (0)</p>
            <ProgressBar progress={0} />
        </div>
        <div>
            <p style={{ margin: '0 0 0.4rem', color: 'var(--text-muted)' }}>En fjerdedel (0.25)</p>
            <ProgressBar progress={0.25} />
        </div>
        <div>
            <p style={{ margin: '0 0 0.4rem', color: 'var(--text-muted)' }}>Halvveis (0.5)</p>
            <ProgressBar progress={0.5} />
        </div>
        <div>
            <p style={{ margin: '0 0 0.4rem', color: 'var(--text-muted)' }}>Fullført (1)</p>
            <ProgressBar progress={1} />
        </div>
    </div>
)

export const InUploadPanel = () => (
    <div style={{
        background: 'var(--surface-raised)',
        padding: '1.25rem',
        borderRadius: 'var(--rounding)',
        display: 'grid',
        gap: '0.75rem',
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Laster opp bilder…</span>
            <span style={{ color: 'var(--text-muted)' }}>62 %</span>
        </div>
        <ProgressBar progress={0.62} />
    </div>
)
