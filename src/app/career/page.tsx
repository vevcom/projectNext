import { Session } from "@/auth/Session";
import PageWrapper from "../_components/PageWrapper/PageWrapper";

export default async function CareerLandingPage() {
    const session = await Session.fromNextAuth()

    return (
        <PageWrapper title={session.user ? "Karriere" : "For bedrifter"}>
            <></>
        </PageWrapper>
    )
}