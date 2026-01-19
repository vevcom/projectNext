import type {
    Class,
    Committee,
    Group,
    GroupType,
    InterestGroup,
    ManualGroup,
    OmegaMembershipGroup,
    StudyProgramme
} from '@/prisma-generated-pn-types'

type PartialNullable<T> = {
    [P in keyof T]?: T[P] | null;
};

/**
 * Dumb type that holds all possible relation to types of groups
 */
export type GroupWithDumbRelations<
    CommitteeKeys extends keyof Committee,
    ManualGroupKeys extends keyof ManualGroup,
    ClassKeys extends keyof Class,
    InterestGroupKeys extends keyof InterestGroup,
    OmegaMembershipGroupKeys extends keyof OmegaMembershipGroup,
    StudyProgrammeKeys extends keyof StudyProgramme
> = Group & PartialNullable<{
    committee: Pick<Committee, CommitteeKeys>,
    manualGroup: Pick<ManualGroup, ManualGroupKeys>,
    class: Pick<Class, ClassKeys>,
    interestGroup: Pick<InterestGroup, InterestGroupKeys>,
    omegaMembershipGroup: Pick<OmegaMembershipGroup, OmegaMembershipGroupKeys>,
    studyProgramme: Pick<StudyProgramme, StudyProgrammeKeys>,
}>

/**
 * Type that holds a relation to spesific gruptype based on the groupType atribute
 */
export type GroupWithRelations<
    CommitteeKeys extends keyof Committee,
    ManualGroupKeys extends keyof ManualGroup,
    ClassKeys extends keyof Class,
    InterestGroupKeys extends keyof InterestGroup,
    OmegaMembershipGroupKeys extends keyof OmegaMembershipGroup,
    StudyProgrammeKeys extends keyof StudyProgramme
> = Exclude<Group, 'groupType'> & ({
    groupType: 'COMMITTEE',
    committee: Pick<Committee, CommitteeKeys>
} | {
    groupType: 'MANUAL_GROUP',
    manualGroup: Pick<ManualGroup, ManualGroupKeys>
} |
{
    groupType: 'CLASS',
    class: Pick<Class, ClassKeys>
} |
{
    groupType: 'INTEREST_GROUP',
    interestGroup: Pick<InterestGroup, InterestGroupKeys>
} |
{
    groupType: 'OMEGA_MEMBERSHIP_GROUP',
    omegaMembershipGroup: Pick<OmegaMembershipGroup, OmegaMembershipGroupKeys>
} |
{
    groupType: 'STUDY_PROGRAMME',
    studyProgramme: Pick<StudyProgramme, StudyProgrammeKeys>
})

export type GroupWithRelationsNameInferencer = GroupWithRelations<
    'name', 'name', 'year', 'name', 'omegaMembershipLevel', 'name'
>

/**
 * Explains meta info about one grouptype like class: klasse, klasser, klassene på NTNU.
*/
export type GroupTypeInfo = {
    name: string,
    namePlural: string,
    description: string
}

/**
 * Type including extra infered fields based on the type of group and the group data
 */
export type ExpandedGroup = Group & {
    firstOrder: number
    name: string
    members: number
}

export type GroupsStructured = {
    [key in GroupType]: GroupTypeInfo & {
        groups: ExpandedGroup[]
    }
}
