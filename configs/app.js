import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRoutes from '../src/users/user.routes.js'
import categorieRoutes from '../src/categories/categories.routes.js'
import productsRoutes from '../src/products/product.routes.js'
import carritoRoutes from '../src/shoppingCart/cart.routes.js'
import facturaRoutes from '../src/facturas/factura.routes.js'

const app = express()
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/usuarios', userRoutes)
app.use('/categorias', categorieRoutes)
app.use('/productos', productsRoutes)
app.use('/carrito/', carritoRoutes)
app.use('/factura', facturaRoutes)

export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}