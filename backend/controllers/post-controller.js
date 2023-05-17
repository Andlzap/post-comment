const router = require('express').Router()
const db = require('../src/db')
const Post = require('../models/post')(db.sequelize, db.DataTypes)
const Comment = require('../models/comment')(db.sequelize, db.DataTypes)

Post.hasMany(Comment)
Comment.belongsTo(Post)

router.get('/', async (req, res) => {
    res.json(await Post.findAll())  
})

router.get('/:id', async (req, res) => {
    const post = await Post.findByPk(req.params.id)
    return res.json({
        post,
        comentarios: await post.getComments()
    })
})

router.post('/', async(req, res) => {
    return res.json(await Post.create(req.body))
})

router.put('/', async(req, res) => {
    const post = await Post.findByPk(req.body.id)

    const { comentario } = req.body
    if (comentario)
    {
        post.createComment({ comentario })
    }

    Object.entries(req.body).forEach(item => {
        const [key, value] = item
        post[key] = value
    })
    await post.save()
    return res.json({message: 'Post atualizado com sucesso!!'})
})

router.delete('/:id', async(req, res) => {
    const post = await Post.findByPk(req.params.id)
    post.destroy()
    return res.json({message: 'Post excluido com sucesso!!'})
})

module.exports = router