'use strict'

import { Router } from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { newSale, viewMyFacturas } from './factura.controller.js'

const api = Router()

api.post('/newSale', validateJwt, newSale)
api.get('/viewMyFacturas', validateJwt, viewMyFacturas)

export default api