'use strict'

import { Schema, model } from 'mongoose'

const facturaSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    nit: {
        type: String
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    products: [{
        cart: {
            type: Schema.ObjectId,
            ref: 'cart'
        }
    }],
    total: {
        type: Number
    }
})

export default model('factura', facturaSchema)