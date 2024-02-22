'use strict'

import { Router } from 'express'
import { registerClient, registerAdmin, login, deleteUser, updateUser, changeRole } from './user.controller.js'
const api = Router()

api.post('/registerClient', registerClient)
api.post('/registerAdmin', registerAdmin)
api.post('/login', login)
api.delete('/deleteUser/:id', deleteUser)
api.put('/updateUser/:id', updateUser)
api.put('/changeRole/:id', changeRole)

export default api