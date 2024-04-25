"use client"

import Form from "@/app/components/Form/Form";
import { MailFlowObject } from "@/server/mail/Types";
import Select from "@/app/components/UI/Select";
import { MailingList } from "@prisma/client";
import { createMailingListGroupRelationAction } from "@/actions/mail/create";



export default function EditGroup({
    id,
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {

    const focusedGroup = data.group[0];
    if (!focusedGroup) {
        throw Error("Could not find group");
    }

    return <div>
        <Form
            title="Legg til mailliste"
            submitText="Legg til"
            action={createMailingListGroupRelationAction}
        >
            <input type="hidden" name="groupId" value={focusedGroup.id} />
            <Select options={mailingLists.map(list => ({value: list.id, label: list.name}))} name="mailingListId" label="Mailliste"/>
        </Form>
    </div>
}