const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const nameOfModule = await models.Module.findAll({
    attributes: ['id', 'nom_module'],
    where: { delete: "false" },
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
    where: { delete: "false" },
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

router.get("/test", async (req, res) => {
  const nameOfModule = await models.Module.findAll({
    attributes: ['id', 'nom_module'],
    include: [{
      model: models.Matiere,
      attributes: ['nom_mat']
    }]
  })
  res.json(nameOfModule)
})

router.post("/", async (req, res) => {
  const module = req.body
  try {
    await models.Module.create(module)
    res.json({ Status: "Success" })
  } catch (error) {
    res.json({ Message: "ErrorDupilation" })
  }
})

router.put("/:id", async (req, res) => {
  const moduleId = req.params.id
  const module = req.body
  try {
    await models.Module.update(module, { where: { id: moduleId } })
    res.json({ Status: "Success" })
  } catch (error) {
    res.json({ Message: "ErrorDupilation" })
  }
})

// soft delete
router.put("/softdelete/:id", async (req, res) => {
  const moduleId = req.params.id
  try {
    await models.Module.update({ delete: "true" }, { where: { id: moduleId } })
    res.json({ Status: "Success" })
  } catch (error) {
    res.json({ Message: "ErrorDupilation" })
  }
})

router.delete("/:id", async (req, res) => {
  const moduleId = req.params.id
  try {
    await models.Module.destroy({
      where: {
        id: moduleId
      }
    })
    res.json("Delete ok")
  } catch (error) {
    console.log(error.message);
    res.json({ Message: "Error" })
  }
})

module.exports = router