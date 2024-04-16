
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import Button from "@/app/components/UI/Button";
import Link from "next/link";

export default async function mailAliases() {

    return (
        <PageWrapper
            title="Innkommende elektronisk post"
        >
        <Link href="./mail/alias">Aliases</Link><br/>
        <Link href="./mail/list">Lister</Link><br/>
        <Link href="./mail/mailAddressExternal">Eksterne mottaker adresser</Link><br/>
        <Link href="./mail/user">Brukere</Link><br/>
        </PageWrapper>
    )
}