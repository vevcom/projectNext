import { readMailAliasAction } from "@/actions/mail/alias/read"
import MailAliasView from "./mailAliasView"
import { notFound } from "next/navigation"


export default async function Alias({ params } : {
    params: {
        aliasId: string
    }
}) {

    const mailAliasData = await readMailAliasAction(Number(params.aliasId))
    if (!mailAliasData.success && mailAliasData.errorCode === 'NOT FOUND') {
        notFound()
    }

    if (!mailAliasData.success) {
        console.error(mailAliasData)
        throw new Error("Failed to fetch mailAlias data.")
    }
    

    return <MailAliasView mailAlias={mailAliasData.data.alias} validForwardingAliases={mailAliasData.data.validForwardingAliases}/>
}