'use strict'

import { Router } from 'express'
import { registerClient, registerAdmin, login, deleteUser, updateUser, changeRole } from './user.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'
const api = Router()

api.post('/registerClient', registerClient)
api.post('/registerAdmin', [validateJwt, isAdmin], registerAdmin) //Solo un admin podra agregar mas admins
api.post('/login', login)
api.delete('/deleteUser/:id', [validateJwt], deleteUser)
api.put('/updateUser/:id', [validateJwt], updateUser)
api.get('/changeRole/:id', [validateJwt, isAdmin], changeRole)

export default api