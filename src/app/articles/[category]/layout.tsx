import styles from './layout.module.scss';
import { notFound } from 'next/navigation';
import { readArticleCategory } from '@/cms/articleCategories/read';
import SideBar from './SideBar';

type PropTypes = {
    params: {
        category: string
    }
    children: React.ReactNode,
}

export default async function ArticleCategoryLayout({ params, children }: PropTypes) {
    const categoryName = decodeURIComponent(params.category); 
    const res = await readArticleCategory(categoryName);
    if (!res.success) return notFound();
    const category = res.data;

    return (
        <div className={styles.wrapper}>
            <SideBar category={category}>
                {children}
            </SideBar>
        </div>
    );
}