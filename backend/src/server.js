(async () => {
        require('dotenv').config()
        const db = require('./db')
        await db.connect()
        const express = require('express')
        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        const userController = require('../controllers/user-controller')

        app.use('/user/v1', userController)

        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Servidor rodando em: ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
        })
})()

