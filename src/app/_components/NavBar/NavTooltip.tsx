'use client'

import styles from './NavTooltip.module.scss'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

type PropTypes = {
    content: string
    children: ReactNode
}

const noopSubscribe = () => () => {}

export default function NavTooltip({ content, children }: PropTypes) {
    // Tooltip.Trigger's asChild clones Radix-managed props (aria-describedby,
    // data-state, pointer/focus handlers, ref) onto children during render.
    // Something in that computation doesn't land identically between the
    // server render and the client's first render pass, causing a hydration
    // mismatch. Rendering the bare children until after mount guarantees the
    // server output and the client's first pass match exactly; the Tooltip
    // wrapper is then added in a normal post-hydration re-render instead.
    const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false)

    if (!mounted) return <>{children}</>

    return (
        <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className={styles.content} side="right" sideOffset={8}>
                        {content}
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )
}
