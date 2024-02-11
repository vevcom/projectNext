import styles from './page.module.scss';

type PropTypes = {
    params: {
        category: string
    },
}

export default async function ArticleCategory({ params }: PropTypes) {
    return (
        <div className={styles.wrapper}>
            <h2>{params.category.toUpperCase()}</h2>
            <p>Velg en artikel i navigasjonsmenyen</p>
        </div>
    );
}