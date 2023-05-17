const router = require('express').Router()
const db = require('../src/db')
const User = require('../models/user')(db.sequelize, db.DataTypes)
const bcrypt = require('bcryptjs')


router.get('/', async (req, res) => {
    const { login } = req.query
    const where = login ? { where: { login } } : undefined
    const users = await User.findAll(where)

    if(users.length === 0) 
        return res.json({message: 'Nenhum usuário encontrado'})

    res.json(users)
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const users = await User.findByPk(id)

    if(!users)
       return res.json({message: 'Nenhum usuário encontrado'})

    res.json(users || {})
})

router.post('/', async(req, res) => {
    const salt = bcrypt.genSaltSync(10)
    const { login, senha, dataNascimento } = req.body
    const users = await User.create({
        login,
        senha: bcrypt.hashSync(senha, salt),
        dataNascimento
    })
    return res.json(users)
})

router.put('/', async(req, res) => {
    try 
    {
    const users = await User.findByPk(req.body.id)
    const { login, senha, dataNascimento} = req.body
    users.login = login
    users.senha = senha
    users.dataNascimento = dataNascimento
    await users.save()
    res.json({message: `Usuario '${login}' atualizado com sucesso`})
    } 
    catch (error)
    {
        res.json({message: error.message})
    }
    
})

router.delete('/:id', async(req, res) => {
    const users = await User.findByPk(req.params.id)

    if(!users)
       return res.json({message: 'Nenhum usuário encontrado'})
    
    const { login } = users.dataValues
    await users.destroy()
    res.json({message: `Usuário '${login}' excluido com sucesso...`})
})


module.exports = router