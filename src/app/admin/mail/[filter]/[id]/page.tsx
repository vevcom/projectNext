"use server"

import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import MailFlow from "./MailFlow";
import { MailListTypeArray, MailListTypes } from "@/server/mail/Types";
import { notFound } from "next/navigation";
import { readMailFlowAction } from "@/actions/mail/read";



export default async function MailFlowPage({
    params
}: {
    params: {
        filter: string,
        id: string,
    }
}) {

    if (!MailListTypeArray.includes(params.filter as MailListTypes /* This is bad practice, but typescript is stupid here */)) {
        notFound();
    }

    const id = Number(params.id)
    if (!id || id <= 0) {
        notFound();
    }

    const filter = params.filter as MailListTypes

    const results = await readMailFlowAction(filter, id);
    if (!results.success) {
        throw new Error("Could not fecth mail flow")
    }

    return <PageWrapper
        title="Innkommende elektronisk post"
    >
        <div>
            Noe info om noen greier. Metadata og slikt
        </div>
        <MailFlow filter={filter} id={id} data={results.data} />
    </PageWrapper>
}