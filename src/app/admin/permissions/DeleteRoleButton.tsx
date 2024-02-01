'use client'

import { destroyRole } from "@/actions/permissions"
import Button from "@/app/components/UI/Button"
import { useRouter } from 'next/navigation'

type PropType = {
    roleId: number
}

export default function DeleteRoleButton({ roleId }: PropType) {
    const router = useRouter()

    async function handleClick() {
        destroyRole(roleId)
        router.refresh()
    }

    return <Button type="button" onClick={handleClick}>Slett</Button>
}