'use strict'

import { Router } from 'express'
import { viewCatalog, newProduct, searchProduct, updateProduct, soldOutProducts, deleteProduct, searchProductByName, bestSellersProducts, viewByCategorie } from './product.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/viewCatalog', validateJwt, viewCatalog)//ya
api.post('/newProduct', [validateJwt, isAdmin], newProduct)//ya
api.get('/searchProduct/:id', validateJwt, searchProduct)//ya
api.put('/updateProduct/:id', [validateJwt, isAdmin], updateProduct)//ya
api.get('/soldOutProducts', [validateJwt, isAdmin], soldOutProducts)//ya
api.delete('/deleteProduct/:id', [validateJwt, isAdmin], deleteProduct)//ya
api.post('/searchProductByName', validateJwt, searchProductByName)//ya
api.get('/bestSellersProducts', validateJwt, bestSellersProducts)//ya
api.get('/viewByCategorie/:id', validateJwt, viewByCategorie)//ya

export default api