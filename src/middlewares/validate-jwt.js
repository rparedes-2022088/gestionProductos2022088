import jwt from 'jsonwebtoken'
import User from '../users/user.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        let secretKey = process.env.SECRET_KEY
        let { token } = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let { uid } = jwt.verify(token, secretKey)
        let user = await User.findOne({_id: uid})
        if(!user) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.user = user
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token or expired'})
    }
}

export const isClient = async(req, res, next)=>{
    try{
        let { role, username } = req.user
        if(!role || role !== 'CLIENT') res.status(403).send({message: `You dont have access ${username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}

export const isAdmin = async(req, res, next)=>{
    try{
        let { role, username } = req.user
        if(!role || role !== 'ADMIN') res.status(403).send({message: `You dont have access ${username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}