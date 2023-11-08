type PropTypes = {
    params: {
        path: string[],
    },
}

export default function EditPath({ params }: PropTypes) {
    const path = params.path.join('/')
    //check that path exists.
    return <>Edit: {path}</>
}