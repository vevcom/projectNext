"use client"

import Form from "@/app/components/Form/Form";
import { MailFlowObject } from "@/server/mail/Types";
import Select from "@/app/components/UI/Select";
import { MailingList } from "@prisma/client";
import { createMailingListUserRelationAction } from "@/actions/mail/create";

export default function EditUser({
    id,
    data,
    mailingLists
}: {
    id: number,
    data: MailFlowObject,
    mailingLists: MailingList[]
}) {

    const focusedUser = data.user[0];
    if (!focusedUser) {
        throw Error("Could not find user");
    }

    return <div>
        <Form
            title="Legg til mailliste"
            submitText="Legg til"
            action={createMailingListUserRelationAction}
        >
            <input type="hidden" name="userId" value={focusedUser.id} />
            <Select options={mailingLists.map(list => ({value: list.id, label: list.name}))} name="mailingListId" label="Mailliste"/>
        </Form>
    </div>
}