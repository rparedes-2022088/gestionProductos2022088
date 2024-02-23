import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import User from './src/users/user.model.js'
import { encrypt } from './src/utils/validator.js'

const userAdminDefault = async()=>{
    try{
        const data = {
            name: 'Rubén',
            surname: 'Paredes',
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

initServer()
connect()
userAdminDefault()