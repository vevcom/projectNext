import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import create from "@/actions/groups/committees/create";
import ImageSelectionProvider from "@/context/ImageSelection";
import ImageList from "@/app/components/Image/ImageList/ImageList";
import ImagePagingProvider, { PageSizeImage } from "@/context/paging/ImagePaging";
import { readSpecialImageCollection } from "@/actions/images/collections/read";
import PopUpProvider from "@/context/PopUp";
import { readSpecialImage } from "@/actions/images/read";

export default async function adminCommittee() {
    const committeeLogoCollectionRes = await readSpecialImageCollection('COMMITEELOGOS')
    if (!committeeLogoCollectionRes.success) throw new Error('Kunne ikke finne komitelogoer')
    const { id: collectionId } = committeeLogoCollectionRes.data

    const defaultCommitteeLogeRes = await readSpecialImage('DAFAULT_COMMITTEE_LOGO')
    if (!defaultCommitteeLogeRes.success) throw new Error('Kunne ikke finne standard komitelogo')
    const defaultCommitteeLogo = defaultCommitteeLogeRes.data

    const pageSize: PageSizeImage = 30

    return (
        <ImagePagingProvider 
            serverRenderedData={[]} 
            details={{
                collectionId,
            }}
            startPage={{
                page: 0,
                pageSize,
            }}
        >
            <PopUpProvider>
                <ImageSelectionProvider 
                    defaultImage={defaultCommitteeLogo}
                    defaultSelectionMode={true}
                >
                    <ImageList />
                    <Form action={create.bind(null, 1)}>
                        <TextInput name="name" label="Navn"/>
                    </Form>
                </ImageSelectionProvider>
            </PopUpProvider>
        </ImagePagingProvider>
    )
}
