'use server'

import { action } from '@/services/action'
import { productOperations } from '@/services/shop/product/operations'
import { shopOperations } from '@/services/shop/shop/operations'

export const readProductsAction = action(productOperations.readMany)
export const readProductAction = action(productOperations.read)
export const createProductAction = action(productOperations.create)
export const updateProductAction = action(productOperations.update)

export const createProductForShopAction = action(productOperations.createForShop)
export const updateProductForShopAction = action(productOperations.updateForShop)

export const createShopProductConnectionAction = action(productOperations.createShopConnection)

export const readShopsAction = action(shopOperations.readMany)
export const readShopAction = action(shopOperations.read)
export const createShopAction = action(shopOperations.create)
