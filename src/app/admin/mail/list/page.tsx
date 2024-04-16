import AddHeaderItemPopUp from "@/app/components/AddHeaderItem/AddHeaderItemPopUp";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import CreateMailingList from "./createMailingListForm";
import { getUser } from "@/auth/getUser";


export default async function mailAliases() {

    const { permissions } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const showAddButton = permissions.includes("MAILINGLIST_CREATE")

    return (
        <PageWrapper
            title="Elektronisk post liste"
            headerItem={
                showAddButton ? <AddHeaderItemPopUp PopUpKey="createMailingList">
                    <CreateMailingList />
                </AddHeaderItemPopUp> : null
            }
        >
            Her kommer det en liste på sikt
        </PageWrapper>
    )
}