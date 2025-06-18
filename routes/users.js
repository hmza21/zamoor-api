import express from 'express'
import db from '../db.js'
const router = express.Router()

// Users Routes

// GET /api/users - Get all users
router.get('/', async (req, res) => {

    const users = await db.query('SELECT * FROM users')
    if (users.rows.length === 0) {
        return res.status(404).json({ message: 'No users found' })
    }
    res.status(200).json(users.rows)

})

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {

    const { id } = req.params
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id])
    if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user.rows[0])

})

// POST /api/users - Create a new user
router.post('/', async (req, res) => {

    const { email, username, password } = req.body
    const exists = await db.query('SELECT * FROM users WHERE email = $1', [email]) || await db.query('SELECT * FROM users WHERE username = $1', [username])
    if (exists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' })
    }

    const result = await db.query(
        'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
        [email, username, password]
    )
    res.status(201).json({ user: result.rows[0] })

})

// PUT /api/users/:id - Update user by ID
router.put('/:id', async (req, res) => {
    
    const { id } = req.params
    const { email, username, password } = req.body

    const exists = await db.query('SELECT * FROM users WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' })
    }

    const result = await db.query(
        'UPDATE users SET email = $1, username = $2, password = $3 WHERE id = $4 RETURNING *',
        [email, username, password, id]
    )
    res.status(200).json({ user: result.rows[0] })

})

// DELETE /api/users/:id - Delete user by ID
router.delete('/:id', async (req, res) => {
    
    const { id } = req.params

    const exists = await db.query('SELECT * FROM users WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' })
    }

    await db.query('DELETE FROM users WHERE id = $1', [id])
    res.status(204).send()

})

// Follow/Unfollow Routes

// GET /api/users/:id/followers - Get followers of a user
router.get('/:id/followers', async (req, res) => {

    const { id } = req.params
    const followers = await db.query(
        'SELECT * FROM users WHERE id IN (SELECT follower_id FROM user_followers WHERE user_id = $1)',
        [id]
    )
    
    if (followers.rows.length === 0) {
        return res.status(404).json({ message: 'No followers found' })
    }
    res.status(200).json(followers.rows)

})

// GET /api/users/:id/following - Get users that a user is following
router.get('/:id/following', async (req, res) => {

    const { id } = req.params
    const following = await db.query(
        'SELECT * FROM users WHERE id IN (SELECT user_id FROM user_followers WHERE follower_id = $1)',
        [id]
    )

    if (following.rows.length === 0) {
        return res.status(404).json({ message: 'No following found' })
    }
    res.status(200).json(following.rows)

})

// POST /api/users/:id/follow - Follow a user
router.post('/:id/follow', async (req, res) => {
    
    const { id } = req.params
    const { userId } = req.body

    const exists = await db.query('SELECT * FROM user_followers WHERE user_id = $1 AND follower_id = $2', [id, userId])
    if (exists.rows.length > 0) {
        return res.status(400).json({ message: 'Already following this user' })
    }

    const result = await db.query(
        'INSERT INTO user_followers (user_id, follower_id) VALUES ($1, $2) RETURNING *',
        [id, userId]
    )
    res.status(201).json({ follow: result.rows[0] })

})

// DELETE /api/users/:id/unfollow - Unfollow a user
router.delete('/:id/unfollow', async (req, res) => {
    
    const { id } = req.params
    const { userId } = req.body

    const exists = await db.query('SELECT * FROM user_followers WHERE user_id = $1 AND follower_id = $2', [id, userId])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'Not following this user' })
    }

    await db.query('DELETE FROM user_followers WHERE user_id = $1 AND follower_id = $2', [id, userId])
    res.status(204).send('Unfollowed successfully')

})

export default router
