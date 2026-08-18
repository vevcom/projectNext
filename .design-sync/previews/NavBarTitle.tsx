import { NavBarTitle, PageWrapper } from '@ohma/ui'

/**
 * NavBarTitle reads the title out of PageTitleContext, which is written by
 * PageWrapper (via PageTitleSetter). With no page mounted it deliberately
 * renders a fixed-height placeholder instead, to avoid hydration layout shift —
 * so both states have to be shown through a real page.
 */
const Bar = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        padding: '0 1rem',
        background: 'var(--surface-raised)',
        borderRadius: 'var(--rounding)',
    }}>
        {children}
    </div>
)

export const WithPageTitle = () => (
    <>
        <Bar><NavBarTitle /></Bar>
        <div style={{ display: 'none' }}>
            <PageWrapper title="Hvad der hender" hideTitle><span /></PageWrapper>
        </div>
    </>
)

export const PlaceholderWithNoTitle = () => (
    <>
        <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)' }}>
            No page title set — renders a reserved-space placeholder:
        </p>
        <Bar><NavBarTitle /></Bar>
    </>
)
