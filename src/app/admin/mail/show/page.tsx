import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import MailFlow from "../(visualization)/MailFlow";



export default function showMail() {



    return <PageWrapper
        title="Innkommende elektronisk post"
    >
        <div>
            Noe info om noen greier. Metadata og slikt
        </div>
        <MailFlow />
    </PageWrapper>
}