import 'server-only'

export type DispatchMethodFunction = (userIds: number[]) => Promise<void>