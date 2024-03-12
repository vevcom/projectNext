// Map between GroupType and corresponding properties of GroupCreateInput.
// (GroupCreateInput is the type that prisma.group.create accepts.)
// This object is needed to be able to assign the data argument input of
// createGroup to the correct field in prisma.group.create.
export const groupEnumToKey = {
    CLASS: 'class',
    COMMITEE: 'commitee',
    INTEREST_GROUP: 'interestGroup',
    OMEGA_MEMBERSHIP: 'omegaMembership',
    STUDY_PROGRAMME: 'studyProgramme',
} as const