import styles from './page.module.scss'
import { readSpecialImageAction } from '@/services/images/actions'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import ImageCard from '@/components/ImageCard/ImageCard'

export default async function education() {
    const hovedbyggningenRes = await readSpecialImageAction.bind(null, {
        special: 'HOVEDBYGGNINGEN'
    })()
    const BooksRes = await readSpecialImageAction.bind(null, {
        special: 'BOOKS'
    })()

    const hovedbyggningen = hovedbyggningenRes.success ? hovedbyggningenRes.data : null
    const Books = BooksRes.success ? BooksRes.data : null

    return (
        <PageWrapper title="Fagveven">
            <p>
                Velkommen til omegas fagvev! Her finner du nyttig info om emner og utveksling skrevet
                av studenter for studenter. Du kan også bidra selv ved å skrive om dine erfaringer
                fra utveksling eller emner du har tatt.
            </p>
            <div className={styles.links}>
                <ImageCard image={hovedbyggningen} title="Skoler" href="/education/schools">
                    <p>På fagveven kan du finne mange ulike skoler som man kan lese om</p>
                </ImageCard>
                <ImageCard image={Books} title="Emner" href="/education/courses">
                    <p>Her kan du lese om ulike emner som du kan ta både på NTNU og på utveksling</p>
                </ImageCard>
            </div>
        </PageWrapper>
    )
}
