import AddHeaderItemPopUp from "@/app/components/AddHeaderItem/AddHeaderItemPopUp";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import CreateMailAlias from "./createAliasForm";


export default function mailAliases() {


    return (
        <PageWrapper
            title="Elektronisk post alias"
            headerItem={
                <AddHeaderItemPopUp PopUpKey="createMailAlias">
                    <CreateMailAlias/>
                </AddHeaderItemPopUp>
            }
        >
            Her kommer det en liste på sikt
        </PageWrapper>
    )
}