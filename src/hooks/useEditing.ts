'use client'
import { useUser } from '@/auth/useUser'
import { EditModeContext } from '@/context/EditMode'
import { checkVisibility } from '@/auth/checkVisibility'
import { useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { Permission } from '@prisma/client'
import type { Matrix } from '@/utils/checkMatrix'
import type { VisibilityCollapsed } from '@/server/visibility/Types'

/**
 * A hook that uses useUser to determine if the user is allowed to edit the content.
 * If the user is allowed to edit the content, the hook will add the content to the list of editable content
 * so EditModeContext will signal editModeSwitches to show.
 * @param requiredPermissions - The permissions required to edit the content. If non are provided, it is
 * assumed that the user is allowed to edit the content.
 * @param requiredVisibility - The visibility required to edit the content. If non is provided, it is
 * assumed that the user is allowed to edit the content.
 * @param operation - The operation to perform on the permissions and visibility. AND or OR, OR by default
 * @param level - The level of visibility required to pass visibility test. ADMIN by default
 * @returns - A bool indicating:
 * - IF the bool is true editMode is on, and the user has the required permissions and/or visibility
 * - IF the bool is false editMode is off or the user does not have the required permissions and/or visibility
 */
export default function useEditing({
    requiredPermissions,
    requiredVisibility,
    operation = 'OR',
    level = 'ADMIN'
}: {
    requiredPermissions?: Matrix<Permission>,
    requiredVisibility?: VisibilityCollapsed
    operation?: 'AND' | 'OR',
    level?: 'ADMIN' | 'REGULAR'
}): boolean {
    const editModeCtx = useContext(EditModeContext)
    const { authorized: permissionAuthorized, permissions, memberships } = useUser({
        requiredPermissions,
        shouldRedirect: false,
    })
    const [authorized, setAuthorized] = useState<boolean>(false)
    //Editable if ctx is on and user has the required permissions and/or visibility
    const [editable, setEditable] = useState<boolean>(false)

    const uniqueKey = useRef(uuid()).current
    useEffect(() => {
        const visibilityAuthorized = requiredVisibility ? checkVisibility({
            permissions: permissions ?? [],
            memberships: memberships ?? [],
        }, requiredVisibility, level) : undefined

        const authorized_ = (operation === 'OR' ?
            permissionAuthorized || visibilityAuthorized :
            permissionAuthorized && visibilityAuthorized) ?? false
        if (editModeCtx) {
            if (authorized_) editModeCtx.addEditableContent(uniqueKey)
            if (!authorized_) editModeCtx.removeEditableContent(uniqueKey)
            setAuthorized(authorized_)
        }
        return () => {
            if (editModeCtx) editModeCtx.removeEditableContent(uniqueKey)
        }
    }, [permissionAuthorized, requiredVisibility, permissions, memberships])

    useEffect(() => {
        setEditable(editModeCtx ? Boolean(authorized) && editModeCtx.editMode : false)
    }, [authorized, editModeCtx?.editMode])

    return editable
}
