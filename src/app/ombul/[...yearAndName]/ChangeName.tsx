import { ReactNode } from "react"
import EditableTextField from "@/components/EditableTextField/EditableTextField"
import { updateOmbul } from "@/actions/ombul/update"

type PropTypes = {
    children: ReactNode
    editable: boolean
    ombulId: number
}

/**
 * Component that wraps the name of ombul in a EditableTextFieldthat can be submitted to update the name
 * On success the name in the url is changed to the new name
 * @param children - The text to display and edit
 * @param editable - Whether the text should be editable
 * @param ombulId - The id of the ombul to update
 * @returns The component jsx
 */
export default function ChangeName({ children, editable, ombulId } : PropTypes) {
    const changeName = updateOmbul.bind(null, ombulId)

    return (
        <EditableTextField
            editable={editable}
            formProps={{
                action: changeName,
                successCallback: () => {}
            }}
            submitButton={{
                name: 'name',
                text: 'lagre'
            }}
        >
            {children}
        </EditableTextField>
    )
}