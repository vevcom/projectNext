'use server'

import { action } from '@/services/action'
import { productMethods } from '@/services/shop/product/methods'
import { shopMethods } from '@/services/shop/shop/methods'

export const readProductsAction = action(productMethods.readMany)
export const readProductAction = action(productMethods.read)
export const createProductAction = action(productMethods.create)
export const updateProductAction = action(productMethods.update)

export const createProductForShopAction = action(productMethods.createForShop)
export const updateProductForShopAction = action(productMethods.updateForShop)

export const createShopProductConnectionAction = action(productMethods.createShopConnection)

export const readShopsAction = action(shopMethods.readMany)
export const readShopAction = action(shopMethods.read)
export const createShopAction = action(shopMethods.create)
