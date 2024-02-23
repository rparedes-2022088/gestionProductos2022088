import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import { userAdminDefault } from './src/users/user.controller.js'
import { categorieDefault } from './src/categories/categories.controller.js'

initServer()
connect()
userAdminDefault()
categorieDefault()