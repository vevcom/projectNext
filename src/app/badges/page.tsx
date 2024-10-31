import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from './page.module.scss'
import { readAllBadgesAction } from "@/actions/users/badges/read";
import { getUser } from "@/auth/getUser";
import Badge from '@/components/Badge/Badge'
import { AddHeaderItemPopUp } from "../_components/HeaderItems/HeaderItemPopUp";
import Form from "@/components/Form/Form";
import { createBadgeAction } from "@/actions/users/badges/create";
import TextInput from "@/components/UI/TextInput";
import Textarea from "@/components/UI/Textarea";
import ColorInput from "@/components/UI/ColorInput";

export default async function Badges() {
    const isBadgeAdmin = await getUser()
    const res = await readAllBadgesAction.bind(null, {})()
    if (!res.success) throw new Error(`Kunne ikke hente badges - ${res.errorCode}`)
    const badges = res.data
    return (
        <PageWrapper title="" headerItem={
            <AddHeaderItemPopUp PopUpKey= "createBadgePopUp">
                <Form action={createBadgeAction.bind(null, {})} title="Lag Badge" submitText="Opprett">
                    <TextInput name="name" label="navn" /> 
                    <Textarea name="description" label="beskrivelse"/>
                    <ColorInput name="color" label="farge"/>
                </Form>
                
            </AddHeaderItemPopUp>
        }> 
            <main className={styles.wrapper}>
                {
                    badges.length ? (
                        badges.map((badge) => (
                            <Badge
                                key={badge.id}
                                badge={badge}
                                asClient={false}
                            >
                            </Badge>
                        ))
                    ) : (
                        <i>
                            Ingen badges å vise
                        </i>
                    )
                }
            </main>
                
        </PageWrapper>
    )
}

