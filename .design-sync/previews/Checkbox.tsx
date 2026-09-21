import { Checkbox } from '@ohma/ui'

export const Default = () => (
    <Checkbox name="newsletter" label="Send meg nyhetsbrev" />
)

export const Checked = () => (
    <Checkbox name="terms" label="Jeg godtar vedtektene" defaultChecked />
)

/**
 * `children` become part of the clickable label. Note the box itself loses the
 * styled appearance in this mode and falls back to the native checkbox — the
 * `.inputAndChildren` branch doesn't carry the custom styling. See NOTES.md.
 */
export const WithChildren = () => (
    <Checkbox name="allergies">
        <strong>Jeg har matallergier</strong>
    </Checkbox>
)

export const Group = () => (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
        <Checkbox name="notifyEmail" label="E-post" defaultChecked />
        <Checkbox name="notifyPush" label="Push-varsel" />
        <Checkbox name="notifySms" label="SMS" />
    </div>
)
