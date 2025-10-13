'use server'

import { makeAction } from '@/services/serverAction'
import { productOperations } from '@/services/shop/product/operations'
import { shopOperations } from '@/services/shop/shop/operations'

export const readProductsAction = makeAction(productOperations.readMany)
export const readProductAction = makeAction(productOperations.read)
export const createProductAction = makeAction(productOperations.create)
export const updateProductAction = makeAction(productOperations.update)

export const createProductForShopAction = makeAction(productOperations.createForShop)
export const updateProductForShopAction = makeAction(productOperations.updateForShop)

export const createShopProductConnectionAction = makeAction(productOperations.createShopConnection)

export const readShopsAction = makeAction(shopOperations.readMany)
export const readShopAction = makeAction(shopOperations.read)
export const createShopAction = makeAction(shopOperations.create)
