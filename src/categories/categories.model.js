'use strict'

import { Schema, model } from 'mongoose'

const categoriesSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
})

export default model('categories', categoriesSchema)