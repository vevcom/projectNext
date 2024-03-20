import { Validation, ValidationType } from "@/server/Validation";
import { z } from "zod";

export const baseGroupRoleActionValidation = new Validation({
    groupId: z.coerce.number(),
    roleId: z.coerce.number(),
    forAdminsOnly: z.coerce.boolean().optional(),
}, {
    groupId: z.coerce.number(),
    roleId: z.coerce.number(),
    forAdminsOnly: z.coerce.boolean().optional(),
})

export const addGroupToRoleActionValidation = baseGroupRoleActionValidation

export type AddGroupToRoleActionType = ValidationType<typeof addGroupToRoleActionValidation>

export const updateGroupRoleRelationActionValidation = baseGroupRoleActionValidation

export type UpdateGroupRoleRelationActionType= ValidationType<typeof updateGroupRoleRelationActionValidation>

export const removeGroupFromRoleActionValidation = baseGroupRoleActionValidation

export type RemoveGroupFromRoleActionType = ValidationType<typeof removeGroupFromRoleActionValidation>