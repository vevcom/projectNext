// Map between GroupType and corresponding properties of GroupCreateInput.
// (GroupCreateInput is the type that prisma.group.create accepts.)
// This object is needed to be able to assign the data argument input of
// createGroup to the correct field in prisma.group.create.
export const groupEnumToKey = {
    CLASS: 'class',
    COMMITTEE: 'committee',
    INTEREST_GROUP: 'interestGroup',
    OMEGA_MEMBERSHIP_GROUP: 'omegaMembershipGroup',
    STUDY_PROGRAMME_GROUP: 'studyProgrammeGroup',
} as const