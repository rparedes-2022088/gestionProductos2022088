'use strict'

import { Router } from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { addProductToCart, editCart, deleteProductCart } from './cart.controller.js'

const api = Router()

api.post('/addProductToCart', validateJwt, addProductToCart)
api.put('/editCart/:id', validateJwt, editCart)
api.delete('/deleteProductCart/:id', validateJwt, deleteProductCart)

export default api