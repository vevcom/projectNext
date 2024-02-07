
type PropTypes = {
    params: {
        category: string
        name: string
    },
}

export default async function ArticleCategory({ params }: PropTypes) {
    //This fixes æ, ø, å and spaces in the url
    const category = decodeURIComponent(params.category);
    const name = decodeURIComponent(params.name);

    return (
        <div>
            <h2>{category} - {name}</h2>
        </div>
    );

}