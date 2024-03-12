import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import create from "@/actions/groups/committees/create";
import ImageSelectionProvider from "@/context/ImageSelection";
import ImageList from "@/app/components/Image/ImageList/ImageList";

export default function adminCommittee() {
    return (
        
        <ImageSelectionProvider>
            <ImageList />
            <Form action={create.bind(null, 1)}>
                <TextInput name="name" label="Navn"/>
            </Form>
        </ImageSelectionProvider>
    )
}
