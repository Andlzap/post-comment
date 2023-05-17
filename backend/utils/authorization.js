const db = require('../src/db')
const User = require('../models/user')(db.sequelize, db.DataTypes)
const jsonwebtoken = require('jsonwebtoken')

const authorized = async (req, res, next) => {
    
    const { authorization } = req.headers

    const [bearer, token] = authorization.split(' ')

    if(!authorization)
    {
        return res.json({ message: 'Envie as credenciais de autorização!!!'})
    }

    if (!/Bearer/.test(bearer))
    {
        return res.json({ message: 'O tipo de autenticação não é a esperada!!!'})
    }

    if(!token)
    {
        return res.json({ message: 'O token não foi informado'})
    }

    try 
    {
        const decode = jsonwebtoken.verify(token, process.env.JWT_SECURITY_TOKEN)
        const users = await User.findByPk(decode.id)
        req.user = users
        return next()
    } 
    catch (error)
    {
        return res.json({ message: `Erro encontrado na verificação: ${err.message}`})
    }

}

module.exports = {
    authorized
}