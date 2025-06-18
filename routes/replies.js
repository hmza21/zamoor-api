import express from 'express'
import db from '../db.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router()

// Replies API routes

// Get all replies for a specific comment
router.get('/:comment_id', isAuthenticated, async (req, res) => {

    const { comment_id } = req.params
    try {
        const replies = await db.query('SELECT * FROM replies WHERE comment_id = $1', [comment_id])
        if (replies.rows.length === 0) {
            return res.status(404).json({ message: 'No replies found for this comment' })
        }
        res.status(200).json(replies.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
    
})

// Create a new reply for a specific comment
router.post('/:comment_id', isAuthenticated, async (req, res) => {

    const { comment_id } = req.params
    const { content, author } = req.body

    if (!content || !author) {
        return res.status(400).json({ message: 'Content and author are required' })
    }

    try {
        const newReply = await db.query(
            'INSERT INTO replies (comment_id, content, author) VALUES ($1, $2, $3) RETURNING *',
            [comment_id, content, author]
        )
        res.status(201).json(newReply.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Update a specific reply
router.delete('/:reply_id', isAuthenticated, async (req, res) => {

    const { reply_id } = req.params

    try {
        const result = await db.query('DELETE FROM replies WHERE id = $1 RETURNING *', [reply_id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Reply not found' })
        }
        res.status(200).json({ message: 'Reply deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Get all likes for a specific reply
router.get('/:reply_id/likes', isAuthenticated, async (req, res) => {

    const { reply_id } = req.params

    try {
        const likes = await db.query('SELECT * FROM likes WHERE reply_id = $1', [reply_id])
        if (likes.rows.length === 0) {
            return res.status(404).json({ message: 'No likes found for this reply' })
        }
        res.status(200).json(likes.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Create a new like for a specific reply
router.post('/:reply_id/likes', isAuthenticated, async (req, res) => {

    const { reply_id } = req.params
    const { user_id } = req.body

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' })
    }

    try {
        const newLike = await db.query(
            'INSERT INTO likes (reply_id, user_id) VALUES ($1, $2) RETURNING *',
            [reply_id, user_id]
        )
        res.status(201).json(newLike.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Delete a specific like from a reply
router.delete('/:reply_id/likes/:like_id', isAuthenticated, async (req, res) => {

    const { reply_id, like_id } = req.params

    try {
        const result = await db.query('DELETE FROM likes WHERE id = $1 AND reply_id = $2 RETURNING *', [like_id, reply_id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Like not found' })
        }
        res.status(200).json({ message: 'Like deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

export default router
