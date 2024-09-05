import getCommittee from '@/app/committees/[name]/getCommittee'
import CmsImage from '@/components/Cms/CmsImage/CmsImage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Form from '@/components/Form/Form'
import { updateCommitteeAction } from '@/actions/groups/committees/update'
import TextInput from '@/app/_components/UI/TextInput'
import type { PropTypes } from '@/app/committees/[name]/page'


export default async function ComitteeAdmin({ params }: PropTypes) {
    const committee = await getCommittee(params)
    return (
        <PageWrapper title={committee.name}>
            <div>
                <p>Admin for {committee.name}</p>
                {
                //TODO: make sure this cms image can only chose images with cirtain permission (
                // can view committees, should be same permission as COMMITTEELOGOS)
                }
                <Form
                    action={updateCommitteeAction.bind(null, committee.id)}
                    submitText="Opdater"
                >
                    <TextInput name="name" label="navn" defaultValue={committee.name}/>
                    <TextInput name="shortName" label="Kortnavn" defaultValue={committee.shortName}/>
                </Form>
            </div>
            <CmsImage cmsImage={committee.logoImage} width={300} />
        </PageWrapper>
    )
}
