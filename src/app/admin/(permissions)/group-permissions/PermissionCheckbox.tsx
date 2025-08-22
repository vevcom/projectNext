'use client'

import Checkbox from '@/components/UI/Checkbox'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { updateGroupPermissionAction } from '@/services/permissions/actions'
import { useState } from 'react'
import type { Permission } from '@prisma/client'


export default function PermissionCheckbox({
    groupId,
    permission,
    value
}: {
    groupId: number,
    permission: Permission,
    value: boolean,
}) {
    const [hasPermission, setHasPermission] = useState(value)
    const [working, setWorking] = useState<boolean>(false)

    async function onClick() {
        setWorking(true)
        const result = unwrapActionReturn(await updateGroupPermissionAction({
            groupId,
            permission,
        }, {
            value: !hasPermission,
        }))

        setHasPermission(result)
        setWorking(false)
    }

    return <>
        {working ? <>
            ⏳
        </> : <Checkbox
            name="abcd"
            checked={hasPermission}
            onClick={onClick}
        />}
    </>
}
