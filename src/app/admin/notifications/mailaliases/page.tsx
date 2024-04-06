import AddHeaderItemPopUp from "@/app/components/AddHeaderItem/AddHeaderItemPopUp";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import CreateMailAlias from "./createAliasForm";
import { getUser } from "@/auth/getUser";


export default async function mailAliases() {

    const { permissions } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const showAddButton = permissions.includes("MAILALIAS_CREATE")

    return (
        <PageWrapper
            title="Elektronisk post alias"
            headerItem={
                showAddButton ? <AddHeaderItemPopUp PopUpKey="createMailAlias">
                    <CreateMailAlias/>
                </AddHeaderItemPopUp> : null
            }
        >
            Her kommer det en liste på sikt
        </PageWrapper>
    )
}