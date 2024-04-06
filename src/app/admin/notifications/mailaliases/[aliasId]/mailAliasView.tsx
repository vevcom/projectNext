"use client"

import { MailAliasExtended } from "@/server/mailalias/Types"


export default function MailAliasView({
    mailAlias,
}: {
    mailAlias: MailAliasExtended
}) {

    console.log(mailAlias)

    return (
        <div>
            Hei
        </div>
    )
}