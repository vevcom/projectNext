import type { PropTypes } from "./layout";

export default async function ArticleCategory({ params }: PropTypes) {
    return (
        <div>
            <h2>{params.category}</h2>
        </div>
    );
}