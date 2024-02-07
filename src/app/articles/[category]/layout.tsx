
export type PropTypes = {
    params: {
        category: string
    },
    children: React.ReactNode,
}

export default function ArticleCategoryLayout({ params, children }: PropTypes) {
    return (
        <div>
            <aside>jiefjfeij</aside>
            {children}
        </div>
    );
}