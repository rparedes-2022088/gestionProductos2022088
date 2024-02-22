'use strict'

import { Router } from 'express'
import { newCategorie, viewCategories, updateCategorie, deleteCategorie } from './categories.controller.js'

const api = Router()

api.post('/newCategorie', newCategorie)
api.get('/viewCategories', viewCategories)
api.put('/updateCategorie/:id', updateCategorie)
api.delete('/deleteCategorie/:id', deleteCategorie)

export default api