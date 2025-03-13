'use server'

import { action } from '@/actions/action'
import { ProductMethods } from '@/services/shop/product/methods'

export const readProductsAction = action(ProductMethods.readMany)
export const readProductAction = action(ProductMethods.read)
export const createProductAction = action(ProductMethods.create)
export const updateProductAction = action(ProductMethods.update)

export const createProductForShopAction = action(ProductMethods.createForShop)
export const updateProductForShopAction = action(ProductMethods.updateForShop)

export const createShopProductConnectionAction = action(ProductMethods.createShopConnection)
