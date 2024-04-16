"use client"
import { destroyMailingListAction } from "@/actions/mail/list/destory";
import Form from "@/app/components/Form/Form"
import { useRouter } from "next/navigation"


export default function MailingListDestory({
    mailingListId,
}: {
    mailingListId: number,
}) {

    const { push } = useRouter();

    return <div>
        <Form
            action={destroyMailingListAction.bind(null, mailingListId)}
            successCallback={() => {
                push('./')
            }}
            submitText="Slett mail liste"
            confirmation={{
                confirm: true,
                text: 'Er du sikker på at du vil slette denne mailing listen? Dette kan ikke angres.'
            }}
            submitColor="red"
        >
        </Form>
    </div>
}