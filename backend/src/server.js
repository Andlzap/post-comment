require('dotenv').config()
console.log(process.env)

const express = require('express')

const app = express()

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor rodando em: ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})