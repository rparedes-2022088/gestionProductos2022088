'use strict'

import Product from './product.model.js'
import Categorie from '../categories/categories.model.js'

export const newProduct = async(req, res)=>{
    try{
        let data = req.data
        let categorie = await Categorie.findOne({_id: data.categorie})
        if(!categorie) return res.status(404).send({message: 'Categorie not found, product not created'})
        let product = new Product(data)
        await product.save()
        return res.send({message: 'Product added succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving product', err})
    }
}

export const searchProduct = async(req, res)=>{
    try{
        let { id } = req.params
        let foundedProduct = await Product.findOne({_id: id})
        if(!foundedProduct) return res.status(404).send({message: 'Product not exists'})
        return res.send({message: `Product ${foundedProduct.name}, price ${foundedProduct.price}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}

export const viewCatalog = async(req, res)=>{
    try{
        let products = await Product.find()
        if(!products) return res.status(404).send({message: 'Products not founded'})
        return res.send({products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error viewing catalog'})
    }
}