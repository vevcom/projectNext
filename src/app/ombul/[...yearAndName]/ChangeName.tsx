import { ReactNode } from "react"
import EditableTextField from "@/components/EditableTextField/EditableTextField"

type PropTypes = {
    children: ReactNode
    editable: boolean
}

export default function ChangeName({children, editable} : PropTypes) {
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