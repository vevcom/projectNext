import { readMailingListAction } from "@/actions/mail/list/read"
import MailingListView from "./mailingListView"
import { notFound } from "next/navigation"


export default async function Alias({ params } : {
    params: {
        listId: string
    }
}) {

    const mailingListData = await readMailingListAction(Number(params.listId))
    if (!mailingListData.success && mailingListData.errorCode === 'NOT FOUND') {
        notFound()
    }

    if (!mailingListData.success) {
        console.error(mailingListData)
        throw new Error("Failed to fetch mailingList data.")
    }
    

    return <MailingListView mailingList={mailingListData.data}/>
}