import express from 'express'
import db from '../db.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router()

// Comments API routes

// Get all comments for a specific post
router.get('/:post_id', isAuthenticated, async (req, res) => {
    
    const { post_id } = req.params
    try {
        const comments = await db.query('SELECT * FROM comments WHERE post_id = $1', [post_id])
        if (comments.rows.length === 0) {
            return res.status(404).json({ message: 'No comments found for this post' })
        }
        res.status(200).json(comments.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
    
})

// Create a new comment for a specific post
router.post('/:post_id', isAuthenticated, async (req, res) => {
    
    const { post_id } = req.params
    const { content, author } = req.body

    if (!content || !author) {
        return res.status(400).json({ message: 'Content and author are required' })
    }

    try {
        const newComment = await db.query(
            'INSERT INTO comments (post_id, content, author) VALUES ($1, $2, $3) RETURNING *',
            [post_id, content, author]
        )
        res.status(201).json(newComment.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Update a specific comment
router.delete('/:comment_id', isAuthenticated, async (req, res) => {
    
    const { comment_id } = req.params

    try {
        const result = await db.query('DELETE FROM comments WHERE id = $1 RETURNING *', [comment_id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Comment not found' })
        }
        res.status(200).json({ message: 'Comment deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Get all likes for a specific comment
router.get('/:comment_id/likes', isAuthenticated, async (req, res) => {
    
    const { comment_id } = req.params

    try {
        const likes = await db.query('SELECT * FROM likes WHERE comment_id = $1', [comment_id])
        if (likes.rows.length === 0) {
            return res.status(404).json({ message: 'No likes found for this comment' })
        }
        res.status(200).json(likes.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Create a new like for a specific comment
router.post('/:comment_id/likes', isAuthenticated, async (req, res) => {
    
    const { comment_id } = req.params
    const { user_id } = req.body

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' })
    }

    try {
        const newLike = await db.query(
            'INSERT INTO likes (comment_id, user_id) VALUES ($1, $2) RETURNING *',
            [comment_id, user_id]
        )
        res.status(201).json(newLike.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }

})

// Delete a specific like from a comment
router.delete('/:comment_id/likes/:like_id', isAuthenticated, async (req, res) => {

    const { comment_id, like_id } = req.params

    try {
        const result = await db.query('DELETE FROM likes WHERE id = $1 AND comment_id = $2 RETURNING *', [like_id, comment_id])
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
