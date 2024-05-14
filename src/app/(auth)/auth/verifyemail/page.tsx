'use server'

import { verifyUserEmailAction } from '@/actions/users/update'
import Button from '@/app/components/UI/Button'
import Link from 'next/link'


export default async function VerifyEmail({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>
}) {
    if (typeof searchParams.token !== 'string') {
        return <>
            <h1>Ops</h1>
            <p>Token ugyldig</p>
        </>
    }

    const verify = await verifyUserEmailAction(searchParams.token)

    console.log(verify)

    if (!verify.success) {
        const errorMessage = verify.error?.map(e => e.message).join('\n') ?? 'JWT er ugyldig'

        return <>
            <h1>Ops</h1>
            <p>{errorMessage}</p>
        </>
    }

    return <>
        <h4>Supert! Da er eposten verifisert!</h4>

        <Link href="/">
            <Button color="primary">Trykk her for å gå til forsiden</Button>
        </Link>
    </>
}
