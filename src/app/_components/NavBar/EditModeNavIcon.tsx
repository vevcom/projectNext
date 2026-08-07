'use client'
import NavTooltip from './NavTooltip'
import EditModeSwitch from '@/components/EditModeSwitch/EditModeSwitch'
import { EditModeContext } from '@/contexts/EditMode'
import { useContext } from 'react'

type PropTypes = {
    className?: string
}

/**
 * Wraps EditModeSwitch together with the nav-icon slot markup (tooltip, hover
 * background) it's shown in. Unlike EditModeSwitch itself - which renders
 * null but still leaves that wrapping markup on the page - this renders
 * nothing at all when there's nothing on the page the user is allowed to
 * edit, so no empty hoverable icon slot is left behind.
 */
export default function EditModeNavIcon({ className }: PropTypes) {
    const editModeCtx = useContext(EditModeContext)
    if (!editModeCtx?.somethingToEdit) return null

    return (
        <NavTooltip content="Edit mode">
            <div className={className}>
                <EditModeSwitch />
            </div>
        </NavTooltip>
    )
}
