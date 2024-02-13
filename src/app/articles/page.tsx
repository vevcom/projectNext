import { readArticleCategories } from "@/cms/articleCategories/read";
import Link from "next/link";
import styles from './page.module.scss';
import PageWrapper from '@/components/PageWrapper/PageWrapper';

export default async function ArticleCategoryList() {
    const res = await readArticleCategories();
    if (!res.success) throw new Error(res.error ? res.error[0].message : 'Noe uforutsett skjedde');
    const categories = res.data;

    return (
        <PageWrapper title="Artikler">
            <main className={styles.wrapper}>
                {
                    categories.length ? (
                        categories.map((category) => (
                            <li key={category.id}>
                                <Link href={`/articles/${category.name}`}>
                                    {category.name}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <i>
                            Ingen kategorier å vise
                        </i>
                    )
                }
            </main>
        </PageWrapper>
    );
}