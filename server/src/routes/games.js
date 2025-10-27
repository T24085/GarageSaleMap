import express from 'express'
import Game from '../models/Game.js'
import Annotation from '../models/Annotation.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const games = await Game.find().lean()
  res.json(games)
})

router.post('/', async (req, res) => {
  const game = await Game.create({
    name: req.body.name,
    ownerId: req.body.ownerId,
    settings: req.body.settings
  })
  res.status(201).json(game)
})

router.get('/:id/annotations', async (req, res) => {
  const annotations = await Annotation.find({ gameId: req.params.id }).lean()
  res.json(annotations)
})

router.post('/:id/annotations', async (req, res) => {
  const annotation = await Annotation.create({
    gameId: req.params.id,
    ...req.body
  })
  res.status(201).json(annotation)
})

export default router
