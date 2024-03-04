import { ReactNode } from "react"
import EditableTextField from "@/components/EditableTextField/EditableTextField"

type PropTypes = {
    children: ReactNode
    editable: boolean
}

/**
 * Component that wraps the name of ombul in a EditableTextFieldthat can be submitted to update the name
 * On success the name in the url is changed to the new name
 * @param children - The text to display and edit
 * @param editable - Whether the text should be editable
 * @returns The component jsx
 */
export default function ChangeName({ children, editable } : PropTypes) {
    return (
        <EditableTextField
            editable={editable}
            formProps={{
                action: () => {},
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