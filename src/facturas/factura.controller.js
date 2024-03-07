'use strict'

import Factura from './factura.model.js'
import Cart from '../shoppingCart/cart.model.js'
import Product from '../products/product.model.js'


export const newSale = async(req, res)=>{
    try{
        let data = req.body
        data.user = req.user._id
        let productos = []
        let total

        let foundedCarts = await Cart.find({user: req.user._id, state: true})
        for(const cart of foundedCarts){
            let productStock = await Product.findOne({_id: cart.product, state: true})
            if(productStock.existences < cart.amount) return res.send({message: 'There is less stock than desired'})
            if(productStock.existences <= 0) return res.send({message: 'Without existences of the product'})
            let stock = productStock.existences - cart.amount
            let sale = productStock.sales + cart.amount
            let stockChange = await Product.findOneAndUpdate({_id: cart.product},{existences: stock, sales: sale})
            productos.push(productStock._id)
            total = total + (productStock.price * cart.amount)
        }
        let udpatedCarts = await Cart.updateMany({user: req.user._id, state: true}, {$set: {state: false}})
        data.products = productos
        data.total = total
        let factura = new Factura(data)
        await factura.save()
        return res.send({message: 'Sale created succesfully', factura})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error creating new sale'})
    }
}

export const viewMyFacturas = async(req, res)=>{
    try{
        let { id } = req.user._id
        let facturas = await Factura.find({user: id}).populate({
            path: 'cart.products',
            populate: {
                path: 'product',
                model: 'product'
            }
        })
        if(!facturas) return res.status(404).send({message: 'Does not have bills'})
        return res.send({message: facturas})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error viewing your bills'})
    }
}