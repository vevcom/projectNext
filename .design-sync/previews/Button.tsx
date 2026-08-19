import { Button } from '@ohma/ui'

export const Colors = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button color="primary">Lagre</Button>
        <Button color="secondary">Avbryt</Button>
        <Button color="green">Meld meg på</Button>
        <Button color="red">Slett arrangement</Button>
    </div>
)

export const Disabled = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button color="primary" disabled>Lagre</Button>
        <Button color="green" disabled>Påmelding stengt</Button>
    </div>
)

export const Submit = () => (
    <form onSubmit={event => event.preventDefault()}>
        <Button type="submit" color="primary">Send inn søknad</Button>
    </form>
)
