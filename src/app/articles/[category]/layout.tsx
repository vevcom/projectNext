import styles from './layout.module.scss';
import { notFound } from 'next/navigation';
import { readArticleCategory } from '@/cms/articleCategories/read';
import Link from 'next/link';

type PropTypes = {
    params: {
        category: string
    },
    children: React.ReactNode,
}

export default async function ArticleCategoryLayout({ params, children }: PropTypes) {
    const res = await readArticleCategory(params.category);
    if (!res.success) return notFound();
    const category = res.data;

    return (
        <div className={styles.wrapper}>
            <aside>
                <h2>{category.name}</h2>
                {
                    category.articles.length ? (
                        <ul>
                        {
                            category.articles.map((article) => (
                                <li>
                                    <Link 
                                        href={`/articles/${category.name}/${article.name}`} 
                                        key={article.id}
                                    >
                                        {article.name}
                                    </Link>
                                </li>
                            ))
                        }
                        </ul>
                    ) : (
                        <p>
                            Ingen artikler å vise
                        </p>
                    )
                }
            </aside>
            {children}
        </div>
    );
}