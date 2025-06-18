import express from 'express'
import db from '../db.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router()

// Authentication routes

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req, res) => {

  const { email, password } = req.body
  const exists = await db.query('SELECT * FROM users WHERE email = $1', [email])
  if (exists.rows.length > 0) return res.status(400).json({ message: 'User already exists' })

  const result = await db.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, password]
  )
  res.status(201).json({ user: result.rows[0] })

})

// POST /api/auth/login - Authenticate a user
router.post('/login', async (req, res, next) => {

  const { email, password } = req.body
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
  )
  if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' })
  
  const user = result.rows[0]
  req.session.userId = user.id
  res.json({ message: 'Login successful' })

})

// GET /api/auth/logout - Log out a user
router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.json({ message: 'User logged out' })
})

router.get('/status', async (req, res) => {
  if (req.session && req.session.userId)
    return res.json({ message: 'User is logged in as ' + req.session.userId })
  return res.json({ message: 'User is not logged in' })
})

export default router
