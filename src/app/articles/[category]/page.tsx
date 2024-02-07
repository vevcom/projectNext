type PropTypes = {
    params: {
        category: string
    },
}

export default async function ArticleCategory({ params }: PropTypes) {
    return (
        <div>
            <h2>{params.category}</h2>
        </div>
    );
}