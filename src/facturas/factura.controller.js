'use strict'

import Factura from './factura.model.js'
import Cart from '../shoppingCart/cart.model.js'
import Product from '../products/product.model.js'
import User from '../users/user.model.js'
import PDFDocument from 'pdfkit'
import fs from 'fs'


export const newSale = async(req, res)=>{
    try{
        let data = req.body
        data.user = req.user._id
        let user = await User.findOne({_id: data.user})
        let productos = []
        let fact = []
        let total = 0

        let foundedCarts = await Cart.find({user: req.user._id, state: true})
        if(foundedCarts.length === 0) return res.send({message: 'El usuario no ha agregado nada aun al carrito'})
        for(const cart of foundedCarts){
            let productStock = await Product.findOne({_id: cart.product, state: true})
            if(productStock.existences < cart.amount) return res.send({message: 'There is less stock than desired'})
            if(productStock.existences <= 0) return res.send({message: 'Without existences of the product'})
            let stock = productStock.existences - cart.amount
            let sale = productStock.sales + cart.amount
            let stockChange = await Product.findOneAndUpdate({_id: cart.product},{existences: stock, sales: sale})
            //console.log(cart)
            fact.push({name: productStock.name, price: productStock.price, amount: cart.amount, subtotal: cart.subtotal})
            productos.push(cart._id)
            total += +cart.subtotal
        }
        
        data.products = productos.map(cartId => ({ cart: cartId }))
        data.total = total

        const filePath = `PurchaseReceipt${user.username}${data.total}.pdf`
        const doc = new PDFDocument()
        doc.pipe(fs.createWriteStream(filePath))
        doc.image('fondo.jpg',0,0, {widht: doc.page.width, height: doc.page.height})
        doc.moveDown()
        doc.fontSize(13).text(`User: ${user.username}`)
        doc.moveDown()
        doc.fontSize(11).text(`Date: ${Date.now()}`)
        doc.moveDown()
        doc.fontSize(11).text('__________________________________________')
        for(const factu of fact){
            doc.moveDown()
            doc.fontSize(11).text(`Product: ${factu.name}`)
            doc.fontSize(11).text(`Price per unit: ${factu.price}`)
            doc.fontSize(11).text(`Amount: ${factu.amount}`)
            doc.fontSize(11).text(`Subtotal: ${factu.subtotal}`)
            doc.moveDown()
            doc.fontSize(11).text('__________________________________________')
        }

        doc.moveDown()
        doc.fontSize(12).text(`Total: ${data.total}`)

        doc.end()
        let udpatedCarts = await Cart.updateMany({user: req.user._id, state: true}, {$set: {state: false}})
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
        let id = req.user._id
        let facturas = await Factura.find({user: id}).populate({
            path: 'products.cart',
            select: 'amount subtotal',
            populate: {
                path: 'product',
                model: 'product',
                select: 'name price'
            }
        })
        if(!facturas) return res.status(404).send({message: 'Does not have bills'})
        return res.send({message: facturas})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error viewing your bills'})
    }
}