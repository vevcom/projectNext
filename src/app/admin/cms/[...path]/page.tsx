type PropTypes = {
    params: Promise<{
        path: string[],
    }>,
}

export default async function EditPath({ params }: PropTypes) {
    const path = (await params).path.join('/')
    //check that path exists.
    return <>Edit: {path}</>
}
