const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const nameOfModule = await models.Module.findAll({
    attributes: ['id', 'nom_module'],
    order: [['id', 'DESC']],
  })
  res.json(nameOfModule)
})

router.get("/info", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const listOfModule = await models.Module.findAll({
    attributes: ['id', 'nom_module'],
    order: [['id', 'DESC']],
    limit,
    offset
  })

  const count = await models.Module.count()

  res.json({ modules: listOfModule, totalPage: Math.ceil(count / limit) })
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const module = await models.Module.findByPk(id)
  res.json(module)
})

router.post("/", async (req, res) => {
  const module = req.body
  await models.Module.create(module)
  res.json(module)
})

router.put("/:id", async (req, res) => {
  const moduleId = req.params.id
  const post = req.body
  await models.Module.update(post, { where: { id: moduleId } })
  res.json(post)
})

router.delete("/:id", async (req, res) => {
  const moduleId = req.params.id
  await models.Module.destroy({
    where: {
      id: moduleId
    }
  })
  res.json("Delete ok")
})

module.exports = router