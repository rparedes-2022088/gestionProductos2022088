'use strict'

import { Schema, model } from 'mongoose'

const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    existences: {
        type: Number,
        default: 1
    },
    sales: {
        type: Number,
        default: 0
    },
    state: {
        type: Boolean,
        default: true
    },
    categorie: {
        type: Schema.ObjectId,
        ref: 'categories',
        required: true
    }
})

export default model('product', productSchema)