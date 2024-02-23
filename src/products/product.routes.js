'use strict'

import { Router } from 'express'
import { viewCatalog, newProduct } from './product.controller.js'

const api = Router()

api.get('/viewCatalog', viewCatalog)
api.post('/newProduct', newProduct)

export default api