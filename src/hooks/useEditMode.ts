'use client'
import useAuther from './useAuther'
import { EditModeContext } from '@/contexts/EditMode'
import { useContext, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import type { AutherDynamicFieldsBound } from '@/auth/auther/Auther'

/**
 * This hook does the following:
 * - If the user is authorized, see the useAuther hook, it will register the component in the edit mode context
 *   signaling that there is a editable component on the page. This causes the context to display the edit mode pencil.
 * - If the user is not authorized, it will not register the component in the edit mode context.
 * @param param0
 * @returns If the component should open editMode, i.e. if the user is authorized and edit mode is enabled.
 */
export default function useEditMode({
    auther
}: {
    auther: AutherDynamicFieldsBound
}): boolean {
    const editModeCtx = useContext(EditModeContext)
    const uniqueKey = useRef(uuid()).current
    const authResult = useAuther({ auther })
    const { addEditableContent, removeEditableContent } = editModeCtx || {
        addEditableContent: () => { },
        removeEditableContent: () => { },
    }
    useEffect(() => {
        if (authResult.authorized) addEditableContent(uniqueKey)
        if (!authResult.authorized) removeEditableContent(uniqueKey)
    }, [auther, authResult, uniqueKey, addEditableContent, removeEditableContent])
    useEffect(() => () => {
        removeEditableContent(uniqueKey)
    }, [uniqueKey, removeEditableContent])
    return authResult.authorized && editModeCtx?.editMode === true
}
