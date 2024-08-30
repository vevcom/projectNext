import { ExpandedSchool } from "@/services/education/schools/Types";
import School from "./School";

/**
 * Used to render schools server side and client side in consistent manner
 * @param school - 
 * @returns 
 */
export const schoolListRenderer = (asClient: boolean) => (school: ExpandedSchool) => <School key={school.shortname} asClient school={school} />