import styles from './layout.module.css';
import { notFound } from 'next/navigation';
import { readArticleCategory } from '@/cms/articleCategories/read';

export type PropTypes = {
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
            </aside>
            {children}
        </div>
    );
}