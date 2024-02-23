'use strict'

import { Router } from 'express'
import { newCategorie, viewCategories, updateCategorie, deleteCategorie } from './categories.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/newCategorie', [validateJwt,isAdmin], newCategorie)
api.get('/viewCategories', [validateJwt], viewCategories)
api.put('/updateCategorie/:id', [validateJwt,isAdmin], updateCategorie)
api.delete('/deleteCategorie/:id', [validateJwt, isAdmin], deleteCategorie)

export default api