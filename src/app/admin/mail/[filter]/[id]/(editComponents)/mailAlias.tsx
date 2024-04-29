"use client"

import TextInput from "@/app/components/UI/TextInput";
import Form from "@/app/components/Form/Form";
import { MailFlowObject } from "@/server/mail/Types";
import Select from "@/app/components/UI/Select";
import { MailingList } from "@prisma/client";
import { createAliasMailingListRelationAction } from "@/actions/mail/create";
import { useUser } from "@/auth/useUser";
import { updateMailAliasAction } from "@/actions/mail/alias/update";
import { useRouter } from "next/navigation";
import { destroyMailAliasAction } from "@/actions/mail/alias/destory";



export default function EditMailAlias({
    id,
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {

    const { push } = useRouter()

    const focusedAlias = data.alias[0];
    if (!focusedAlias) {
        throw Error("Could not find alias");
    }

    const uResults = useUser();
    const permissions = uResults.permissions ?? [];

    return <>
        <h2>{focusedAlias.address}</h2>
        { permissions.includes("MAILALIAS_UPDATE") && <div>
            <Form
                title="Alias"
                submitText="Oppdater"
                action={updateMailAliasAction}
            >
                <input type="hidden" name="id" value={focusedAlias.id} />
                <TextInput name="address" label="Epost" defaultValue={focusedAlias.address} />
                <TextInput name="description" label="Beskrivelse" defaultValue={focusedAlias.description} />
            </Form>
        </div>}
        { permissions.includes("MAILALIAS_DESTORY") && <div>
            <Form
                action={destroyMailAliasAction.bind(null, focusedAlias.id)}
                successCallback={() => push("/admin/mail")}
                submitText="Slett"
                submitColor="red"
                confirmation={{
                    confirm: true,
                    text: 'Sikker på at du vil slette dette mailaliaset? Dette kan ikke angres.',
                }}
            />
        </div> }
        { permissions.includes("MAILINGLIST_ALIAS_CREATE") && <div>
            <Form
                title="Legg til mailliste"
                submitText="Legg til"
                action={createAliasMailingListRelationAction}
            >
                <input type="hidden" name="mailAliasId" value={focusedAlias.id} />
                <Select options={mailingLists.map(list => ({value: list.id, label: list.name}))} name="mailingListId" label="Mailliste"/>
            </Form>
        </div>}
    </>
}