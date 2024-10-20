'use server'
import { Action } from "@/actions/Action"
import { JobAds } from "@/services/career/jobAds"

export const updateJobAdAction = Action(JobAds.update)