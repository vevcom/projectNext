'use client'
import { PermissionMatrix } from "@/auth/checkPermissionMatrix"
import { UserWithPermissions } from "@/auth/getUser"
import { useUser } from "@/auth/useUser"
import { EditModeContext } from "@/context/EditMode"
import { useContext, useEffect, useRef } from "react"
import { v4 as uuid } from 'uuid';

/**
 * A hook that uses useUser to determine if the user is allowed to edit the content.
 * If the user is allowed to edit the content, the hook will add the content to the list of editable content
 * so EditModeContext will signal editModeSwitches to show.
 * @param requiredPermissions - The permissions required to edit the content
 * @returns - A bool indicating:
 * - IF the bool is true editMode is on and the user has the required permissions
 * - IF the bool is false editMode is off or the user does not have the required permissions
 */
export default function useEditing(requiredPermissions: PermissionMatrix) : boolean {
    const editMode = useContext(EditModeContext)
    const { authorized } = useUser({
        requiredPermissions,
    })
    const uniqueKey = useRef(uuid()).current;

    useEffect(() => {
        if (editMode) {
            if (authorized) editMode.addEditableContent(uniqueKey)
            if (!authorized) editMode.removeEditableContent(uniqueKey)
        }
        return () => {
            if (editMode) editMode.removeEditableContent(uniqueKey)
        }
    }, [authorized, editMode])

    return editMode ? authorized && editMode.editMode : false
}
