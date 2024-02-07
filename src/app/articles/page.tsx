import { readArticleCategories } from "@/cms/articleCategories/read";
import Link from "next/link";

export default async function ArticleCategoryList() {
    const res = await readArticleCategories();
    if (!res.success) throw new Error(res.error ? res.error[0].message : 'Noe uforutsett skjedde');
    const categories = res.data;

    return (
        <ul>
            {
                categories.length ? (
                    categories.map((category) => (
                        <li key={category.id}>
                            <Link href={`/${category.name}`}>
                                {category.name}
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>
                        Ingen kategorier å vise
                    </li>
                )
            }
        </ul>
    );
}