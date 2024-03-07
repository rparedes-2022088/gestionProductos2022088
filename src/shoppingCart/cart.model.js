'use strict'

import { Schema, model } from 'mongoose'

const cartSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    product: {
        type: Schema.ObjectId,
        ref: 'product',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number
    },
    state: {
        type: Boolean,
        default: true
    }
})

export default model('cart', cartSchema)