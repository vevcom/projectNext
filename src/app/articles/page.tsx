import { readArticleCategories } from "@/cms/articleCategories/read";
import styles from './page.module.scss';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import ImageCard from "../components/ImageCard/ImageCard";

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
                            <ImageCard 
                                title={category.name} 
                                href={`/articles/${category.name}`}
                                image={category.coverImage}
                            >
                                {category.description}
                            </ImageCard>
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