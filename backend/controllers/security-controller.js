const router = require('express').Router()
const db = require('../src/db')
const User = require('../models/user')(db.sequelize, db.DataTypes)
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/login', async (req,res) => {
    const {login, senha} = req.body
    const users = await User.findOne({ where: { login }})
    if (!users)
    {
        return res.json({message: 'Usuário não encontrado'})
    }

    const passwordIsOk = await bcrypt.compare(senha, users.senha)
    if(!passwordIsOk)
    {
        return res.json({message: 'Senha inválida'})
    }

    const token = jsonwebtoken.sign({ id: users.id }, process.env.JWT_SECURITY_TOKEN)

    return res.json({ token })

})

module.exports = router
