'use server'

import { Shop } from '@/services/shop'
import { Action, ActionNoData } from '@/actions/Action'


export const readShops = ActionNoData(Shop.readShops)
export const readShop = ActionNoData(Shop.readShop)
export const createShop = Action(Shop.createShop)

export const readProducts = ActionNoData(Shop.readProducts)
export const readProduct = ActionNoData(Shop.readProduct)
export const createProduct = Action(Shop.createProduct)
export const updateProduct = Action(Shop.updateProduct)

export const createProductForShop = Action(Shop.createProductForShop)
export const updateProductForShop = Action(Shop.updateProductForShop)

export const createShopProductConnectionAction = Action(Shop.createShopProductConnection)
