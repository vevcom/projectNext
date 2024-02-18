type PropTypes = {
    params: {
        name: string
    }
}


export default async function NewsArticle({ params }: PropTypes) {
    return (
        <div>
            <h1>{params.name}</h1>
        </div>
    )
}