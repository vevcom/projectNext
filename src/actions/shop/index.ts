'use server'

import { action } from '@/actions/action'
import { createProduct, createProductForShop, createShopProductConnection } from '@/services/shop/product/create'
import { readProduct, readProducts } from '@/services/shop/product/read'
import { updateProduct, updateProductForShop } from '@/services/shop/product/update'
import { createShop } from '@/services/shop/shop/create'
import { readShop, readShops } from '@/services/shop/shop/read'

export const readShopsAction = action(readShops)
export const readShopAction = action(readShop)
export const createShopAction = action(createShop)

export const readProductsAction = action(readProducts)
export const readProductAction = action(readProduct)
export const createProductAction = action(createProduct)
export const updateProductAction = action(updateProduct)

export const createProductForShopAction = action(createProductForShop)
export const updateProductForShopAction = action(updateProductForShop)

export const createShopProductConnectionAction = action(createShopProductConnection)
