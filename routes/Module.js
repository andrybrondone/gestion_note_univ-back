const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const listOfModule = await models.Module.findAll({
    attributes: ['id', 'nom_module']
  })
  res.json(listOfModule)
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