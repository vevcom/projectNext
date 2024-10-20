'use server'
import { ActionNoData } from "@/actions/Action"
import { JobAds } from "@/services/career/jobAds"

export const destroyJobAdAction = ActionNoData(JobAds.destroy)