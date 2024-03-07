'use strict'

import Product from './product.model.js'
import Categorie from '../categories/categories.model.js'

export const newProduct = async(req, res)=>{
    try{
        let data = req.body
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
        let foundedProduct = await Product.findOne({_id: id, state: true})
        if(!foundedProduct) return res.status(404).send({message: 'Product not exists'})
        return res.send({message: `Product ${foundedProduct.name}, price ${foundedProduct.price}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}

export const viewCatalog = async(req, res)=>{
    try{
        let products = await Product.find({state: true}).populate('categorie',['name','description'])
        if(!products) return res.status(404).send({message: 'Products not founded'})
        return res.send({products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error viewing catalog'})
    }
}

export const updateProduct = async(req, res)=>{
    try{
        let data = req.body
        let { id } = req.params
        let productFounded = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!productFounded) return res.status(404).send({message: 'Product not founded and not updated'})
        return res.send({message: `Product updated succesfully ${productFounded}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const soldOutProducts = async(req, res)=>{
    try{
        let soldOut = find({existences: 0, state: true})
        if(!soldOut) return res.send({message: 'There are not products sold out'})
        return res.send({soldOut})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error viewing sold out products'})
    }
}

export const deleteProduct = async(req, res)=>{
    try{
        let { id } = req.params
        let estado = {
            state: false
        }
        let deletedProduct = await Product.findOneAndUpdate({_id: id}, estado, {new: true})
        if(!deletedProduct) return res.status(404).send({message: 'Product not founded and not deleted'})
        let productState = await Product.findOne({_id: id, state: false})
        if(productState) return res.send({message: 'Product deleted previously'})
        return res.send({message: `Product ${deletedProduct.name} deleted`})
    }catch(err){
        console.error(err)
    }
}

export const searchProductByName = async(req, res)=>{
    try{
        let data = req.body
        let foundedProduct = await Product.findOne({name: data.name, state: true})
        if(!foundedProduct) return res.status(404).send({message: 'Product not found'})
        return res.send({message: `Product ${foundedProduct.name}, price ${foundedProduct.price}, existences ${foundedProduct.existences}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}

export const bestSellersProducts = async(req, res)=>{
    try{
        let products = await Product.find().sort({sales: -1})
        if(!products) return res.status(404).send({message: 'There are not products'})
        return res.send({message: products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error viewing best sellers'})
    }
} 

export const viewByCategorie = async(req,res)=>{
    try {
        let { id } = req.params
        let product = await Product.find({categorie: id}, {state: true})
        if(!product || product.state == false) return res.status(404).send({message: 'Products not found'})
        let foundedProduct = await Product.find({_id: product._id}).populate('categorie',['categorie','description'])
        return res.send({message:'Product',foundedProduct})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error searching products by categorie'})
        
    }
}