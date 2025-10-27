import express from 'express'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'

const router = express.Router()

// TODO: replace with proper credential validation
router.post('/login', async (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'username required' })
  }

  const token = jwt.sign({ id: 'user-uuid', username }, process.env.JWT_SECRET, { expiresIn: '4h' })
  return res.json({ token })
})

export default router
