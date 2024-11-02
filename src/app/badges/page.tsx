import PageWrapper from "@/components/PageWrapper/PageWrapper";
import styles from './page.module.scss'
import { readAllBadgesAction } from "@/actions/users/badges/read";
import { getUser } from "@/auth/getUser";
import Badge from '@/components/Badge/Badge'
import { AddHeaderItemPopUp, SettingsHeaderItemPopUp } from "../_components/HeaderItems/HeaderItemPopUp";
import Form from "@/components/Form/Form";
import { createBadgeAction } from "@/actions/users/badges/create";
import TextInput from "@/components/UI/TextInput";
import Textarea from "@/components/UI/Textarea";
import ColorInput from "@/components/UI/ColorInput";
import { AdminBadgeAuther } from "@/services/users/badges/Authers";




export default async function Badges() {
   
    const { session, ...res } = await readAllBadgesAction.bind(null, {})()
    if (!res.success) throw new Error(`Kunne ikke hente badges - ${res.errorCode}`)
    const isBadgeAdmin = AdminBadgeAuther.dynamicFields({}).auth(session)
    const badges = res.data
    return (
        <PageWrapper title="" headerItem={
            isBadgeAdmin.authorized ? (
            <AddHeaderItemPopUp PopUpKey="createBadgePopUp">
                <Form refreshOnSuccess action={createBadgeAction.bind(null, {})} title="Lag Badge" submitText="Opprett">
                    <TextInput name="name" label="navn" /> 
                    <Textarea name="description" label="beskrivelse"/>
                    <ColorInput name="color" label="farge"/>
                </Form>  
            </AddHeaderItemPopUp> ): null
        }> 
            <main className={styles.wrapper}>
                {
                    badges.length ? (
                        badges.map((badge) => (
                            <Badge
                                key={badge.id}
                                badge={badge}
                                asClient={false}
                                isAdmin={isBadgeAdmin.authorized} 
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

