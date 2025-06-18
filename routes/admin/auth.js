import express from 'express'
import db from '../db.js'
const router = express.Router()

router.post('/register', async (req, res) => {
  const { admin_id, email, password } = req.body
  const invoker = await db.query('SELECT * FROM admins WHERE id = $1', [admin_id])

  if (invoker.rows.length === 0) return res.status(403).json({ message: 'Forbidden' })

  const exists = await db.query('SELECT * FROM admins WHERE email = $1', [email])
  if (exists.rows.length > 0) return res.status(400).json({ message: 'Admin user already exists' })

  const result = await db.query(
    'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING *',
    [email, password]
  )
  res.status(201).json({ user: result.rows[0] })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const result = await db.query(
    'SELECT * FROM admins WHERE email = $1 AND password = $2',
    [email, password]
  )
  if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' })
  res.json({ user: result.rows[0] })
})

export default router
