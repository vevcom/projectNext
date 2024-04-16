"use client"
import { destroyMailAliasAction } from "@/actions/mail/alias/destory";
import Form from "@/app/components/Form/Form"
import { useRouter } from "next/navigation"


export default function MailAliasDestory({
    aliasId,
}: {
    aliasId: number,
}) {

    const { push } = useRouter();

    return <div>
        <Form
            action={destroyMailAliasAction.bind(null, aliasId)}
            successCallback={() => {
                push('./')
            }}
            submitText="Slett alias"
            confirmation={{
                confirm: true,
                text: 'Er du sikker på at du vil slette dette aliaset? Dette kan ikke angres.'
            }}
            submitColor="red"
        >
        </Form>
    </div>
}