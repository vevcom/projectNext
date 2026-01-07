'use client'
import useAuthorizer from './useAuther'
import { EditModeContext } from '@/contexts/EditMode'
import { useContext, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'

/**
 * This hook does the following:
 * - If the user is authorized, see the useAuthorizer hook, it will register the component in the edit mode context
 *   signaling that there is a editable component on the page. This causes the context to display the edit mode pencil.
 * - If the user is not authorized, it will not register the component in the edit mode context.
 * @param param0
 * @returns If the component should open editMode, i.e. if the user is authorized and edit mode is enabled.
 */
export default function useEditMode({
    authorizer
}: {
    authorizer: AuthorizerDynamicFieldsBound
}): boolean {
    const editModeCtx = useContext(EditModeContext)
    const uniqueKey = useRef(uuid()).current
    const authResult = useAuthorizer({ authorizer })
    useEffect(() => {
        if (editModeCtx) {
            if (authResult.authorized) editModeCtx.addEditableContent(uniqueKey)
            if (!authResult.authorized) editModeCtx.removeEditableContent(uniqueKey)
        }
        return () => {
            if (editModeCtx) editModeCtx.removeEditableContent(uniqueKey)
        }
    }, [editModeCtx, authorizer, authResult, uniqueKey])
    return authResult.authorized && editModeCtx?.editMode === true
}
