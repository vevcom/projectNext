import styles from './page.module.scss';

type PropTypes = {
    params: {
        category: string
    },
}

export default async function ArticleCategory({ params }: PropTypes) {
    const category = decodeURIComponent(params.category);
    return (
        <div className={styles.wrapper}>
            <h2>{category.toUpperCase()}</h2>
            <p>Velg en artikel i navigasjonsmenyen</p>
        </div>
    );
}