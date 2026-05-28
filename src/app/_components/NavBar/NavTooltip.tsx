'use client'

import styles from './NavTooltip.module.scss'
import * as Tooltip from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

type PropTypes = {
    content: string
    children: ReactNode
}

export default function NavTooltip({ content, children }: PropTypes) {
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
