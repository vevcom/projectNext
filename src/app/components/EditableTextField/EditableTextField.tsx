'use client'
import React, { useContext } from 'react'
import { EditModeContext } from '@/context/EditMode'
import type { Permission } from '@prisma/client'

type PropTypes = {
    text: string,
    tag: keyof JSX.IntrinsicElements,
    permissions?: Permission[],
    props?: React.HTMLAttributes<HTMLElement>
}

export default function EditableTextField({text, tag, permissions, ...props}: PropTypes) {
    const Tag = tag
    const editMode = useContext(EditModeContext)
    if (!editMode?.editMode || permissions.include) return (
        <Tag {...props}>{text}</Tag>
    )
    return (
        <Tag {...props}>{text}</Tag>
    )
}
