'use strict'

import Categorie from './categories.model.js'
import Product from '../products/product.model.js'

export const newCategorie = async(req, res)=>{
    try{
        let data = req.body
        let categorie = new Categorie(data)
        await categorie.save()
        return res.send({message: 'Categorie added succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving categorie', err})
    }
}

export const viewCategories = async(req, res)=>{
    try{
        let categories = await Categorie.find()
        if(!categories) res.status(404).send({message: 'Categories not found'})
        return res.send({categories})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error viewing categories'})
    }
}

export const updateCategorie = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let updatedCategorie = await Categorie.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCategorie) return res.status(401).send({message: 'Categorie not found and not updated'})
        return res.send({message: 'Updated categorie', updatedCategorie})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating categorie'})
    }
}

export const deleteCategorie = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedCategorie = await Categorie.findOneAndDelete({_id: id})
        if(!deletedCategorie) return res.status(404).send({message: 'Categorie not found and not deleted'})
        let defaultCategorie = await Categorie.findOne({name: 'Default categorie'})
        let productsDeletedCategorie = await Product.updateMany({categorie: deletedCategorie._id},{$set: {categorie:defaultCategorie._id}})
        if(!productsDeletedCategorie) return res.send({message: 'No hay productos en esta categoria'})
        //Falta que al eliminar se actualicen los productos de esta categoria a una default
        return res.send({message: `Categorie deleted ${deletedCategorie.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting categorie'})
    }
}

export const categorieDefault = async()=>{
    try{
        const data = {
            name: 'Default categorie',
            description: 'Default categorie'
        }
        let defualtCreated = await Categorie.findOne({name: data.name})
        if(!defualtCreated){
            let categorie = new Categorie(data)
            await categorie.save()
        }
        console.log('Categorie default created previously')
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error creating default categorie'})
    }
}