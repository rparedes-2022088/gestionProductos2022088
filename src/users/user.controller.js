'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const registerClient = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving user', err})
    }
}

export const registerAdmin = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'ADMIN'
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving user'})
    }
}

export const login = async(req, res)=>{
    try{
        let { username, password, email } = req.body
        let user = await User.findOne({
            $or: [{
                username: username
            },
            {
                email: email
            }]
        })
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${loggedUser.username}`,
                    loggedUser,
                    token
                }
            )
            return res.send({message: `Welcome ${user.name}`, loggedUser})
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Failed to login'})
    }
}

export const deleteUser = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedUser = await User.findOneAndDelete({_id: id})
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

export const updateUser = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumbmitted some data that cannot be updated or missing data'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const changeRole = async(req, res)=>{
    try{
        let { id } = req.params
        let foundUser = await User.findOne({_id: id})
        if(!foundUser) res.status(404).send({message: 'User not found, role not changed'})
        if(foundUser.role == 'ADMIN') await User.findOneAndUpdate(
            {_id: id},
            {role: 'CLIENT'},
            {new: true}
        )
        if(foundUser.role == 'CLIENT') await User.findOneAndUpdate(
            {_id: id},
            {role: 'ADMIN'},
            {new: true}
        )
        return res.send({message: 'Role changed'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error changing role'})
    }
}

export const userAdminDefault = async()=>{
    try{
        const data = {
            name: 'Rubén',
            surname: 'Paredes',
            email: 'rparedes@kinal.edu.gt',
            username: 'rparedes1',
            password: await encrypt('12345678'),
            phone: 12345678,
            role: 'ADMIN'
        }
        let defualtCreated = await User.findOne({username: data.username})
        if(!defualtCreated){
            let user = new User(data)
            await user.save()
        }
        console.log('Usuario default creado con anterioridad')
    }catch(err){
        console.error(err)
        console.log('Error creando al usuario Admin por defecto')
    }
}