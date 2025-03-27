'use server'

import { action } from '@/actions/action'
import { ShopMethods } from '@/services/shop/shop/methods'

export const readShopsAction = action(ShopMethods.readMany)
export const readShopAction = action(ShopMethods.read)
export const createShopAction = action(ShopMethods.create)

