'use strict'

import Cart from './cart.model.js'
import Product from '../products/product.model.js'
import User from '../users/user.model.js'

export const addProductToCart = async(req, res)=>{
    try{
        let data = req.body
        let foundedProduct = await Product.findOne({_id: data.product, state: true})
        if(!foundedProduct) return res.status(404).send({message: 'Product not exists'})
        if(foundedProduct.existences <= data.amount) return res.send({message: `Insufficient stock, the stock is ${foundedProduct.existences}`})
        let subtotal = foundedProduct.price * data.amount
        let datos = {
            user: req.user._id,
            product: data.product,
            amount: data.amount,
            subtotal: subtotal
        }
        let cart = new Cart(datos)
        await cart.save()
        return res.send({message: 'Product added succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error adding product to cart'})
    }
}

export const editCart = async(req, res)=>{
    try{
        let data = req.body
        let { id } = req.params
        if(data.user) return res.status(401).send({message: 'User cannot be updated'})
        let foundedProduct = await Product.findOne({_id: data.product})
        if(!foundedProduct) return res.status(404).send({message: 'Product not found cart not updated'})
        if(foundedProduct.existences <= data.amount) return res.send({message: 'Insufficient stock'})
        data.subtotal = data.product * data.amount
        let foundedCart = await Cart.findOne({_id: id, state: true})
        if(!foundedCart) return res.status(404).send({message: 'Cart not found'})
        if(foundedCart.user == req.user._id){
            let updatedCart = await Cart.findOneAndUpdate(
                {_id: id, state: true},
                data,
                {new: true}
            )
            return res.send({message: 'Product updated succesfully', updatedCart})
        }
        return res.status(401).send({message: 'Cannot update the cart of other user'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating cart'})
    }
}

export const deleteProductCart = async(req, res)=>{
    try{
        let { id } = req.params
        let cartUser = await Cart.findOne({_id_: id})
        if(cartUser.user == req.user._id){
            let foundedCart = await Cart.findOneAndDelete({_id: id, state: true})
            if(!foundedCart) return res.status(404).send({message: 'Cart not exists, not deleted'})
            return res.send({message: 'Product deleted from the cart', foundedCart})
        }
        return res.status(501).send({message: 'Cannot delete product of cart of other user'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting product of the cart'})
    }
}