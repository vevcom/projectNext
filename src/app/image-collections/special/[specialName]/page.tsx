type PropTypes = {
    params: Promise<{
        specialName: string
    }>
}

export default async function SpecialImageCollection({ params }: PropTypes) {
    await params
    return null
}
