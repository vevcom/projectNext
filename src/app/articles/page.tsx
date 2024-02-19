import { readArticleCategories } from "@/cms/articleCategories/read";
import styles from './page.module.scss';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import ImageCard from "../components/ImageCard/ImageCard";
import PopUp from "../components/PopUp/PopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddCategory from "./AddCategory";

export default async function ArticleCategoryList() {
    const res = await readArticleCategories();
    if (!res.success) throw new Error(res.error ? res.error[0].message : 'Noe uforutsett skjedde');

    const categories = res.data;

    //TODO: add can create categoies permission
    const canCreateArticleCategories = true; //temp

    return (
        <PageWrapper title="Artikler" headerItem={
            canCreateArticleCategories && (
                <PopUp
                    PopUpKey="CreateCategory"
                    showButtonContent={
                        <FontAwesomeIcon className={styles.addIcon} icon={faPlus} />
                    }
                    showButtonClass={styles.addCategory}
                >
                    <AddCategory />
                </PopUp>
            )
        }>
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