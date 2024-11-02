import styles from './Badge.module.scss'
import type { Badge } from '@prisma/client'
import CmsImageClient from '@/cms/CmsImage/CmsImageClient'
import CmsImage from '@/cms/CmsImage/CmsImage'
import type { ExpandedBadge } from '@/services/users/badges/Types'
import { updateBadgeAction } from "@/actions/users/badges/update";
import { destroyBadgeAction } from '@/actions/users/badges/destroy'
import { SettingsHeaderItemPopUp } from "@/components/HeaderItems/HeaderItemPopUp";
import Form from "@/components/Form/Form";
import TextInput from '../UI/TextInput'
import ColorInput from '../UI/ColorInput'



type PropTypes = {
    badge: ExpandedBadge,
    asClient: Boolean
    isAdmin?: Boolean
}

export default function Badge({ badge, asClient = false, isAdmin = false}: PropTypes) {
    return (
        <div className={styles.Badge}>
            <div style = {{borderColor:`rgb(${badge.colorR}, ${badge.colorG}, ${badge.colorB})`}} className = {styles.cmsImageContainer} >
            {
                asClient ? (
                    <CmsImageClient
                        className={styles.cmsImage}
                        classNameImage={styles.image}
                        cmsImage={badge.cmsImage}
                        width={200}
                    />
                ) :  
                    <CmsImage
                    className={styles.cmsImage}
                    classNameImage={styles.image}
                    cmsImage={badge.cmsImage}
                    width={200}
                />
                
            } 
            </div>
            <div className={styles.text}>
                <h2 className={styles.name}>
                    {badge.name}
                </h2>
                <p>
                    {badge.description}
                </p>
            </div>

            <div className = {styles.update}> 
                {
                isAdmin ? ( 
                <SettingsHeaderItemPopUp scale={25} PopUpKey={`UpdateBadgePopUp${badge.id}`}>
                    <Form refreshOnSuccess action={updateBadgeAction.bind(null, {id: badge.id})} title = "Oppdater Badge" submitText="Oppdater">
                            <TextInput name="name" label="navn" defaultValue={badge.name}/>
                            <TextInput name="description" label="beskrivelse" defaultValue={badge.description}/>
                            <ColorInput name="color" label="Farge" defaultValueRGB={{r: badge.colorR, g: badge.colorG, b: badge.colorB}}/>
                    </Form>
                    <Form refreshOnSuccess action={destroyBadgeAction.bind(null, {id: badge.id })} submitColor="red"
                        confirmation={{confirm: true, text: 'Er du sikker på at du vil slette denne badgen?'}} 
                        submitText="Slett"/>
                </SettingsHeaderItemPopUp> 
                ): null}
            </div>
        </div>
    )
}
