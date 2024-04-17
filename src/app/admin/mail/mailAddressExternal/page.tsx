import AddHeaderItemPopUp from "@/app/components/AddHeaderItem/AddHeaderItemPopUp";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import CreateMailaddressExternal from "../createMailaddressExternalForm";
import { getUser } from "@/auth/getUser";


export default async function mailAdressExternal() {

    const { permissions } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const showAddButton = permissions.includes("MAILADDRESS_EXTERNAL_CREATE")

    return (
        <PageWrapper
            title="Eksterne mottaker addresser"
            headerItem={
                showAddButton ? <AddHeaderItemPopUp PopUpKey="createMailaddressExternal">
                    <CreateMailaddressExternal />
                </AddHeaderItemPopUp> : null
            }
        >
            Her kommer det en liste på sikt
        </PageWrapper>
    )
}