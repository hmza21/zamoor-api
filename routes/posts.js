import express from 'express'
import db from '../db.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = express.Router()

// Posts Routes

// GET /api/posts - Get all posts
router.get('/', isAuthenticated, async (req, res) => {
    
    const posts = await db.query('SELECT * FROM posts')
    if (posts.rows.length === 0) {
        return res.status(404).json({ message: 'No posts found' })
    }
    res.status(200).json(posts.rows)

})

// GET /api/posts/:id - Get post by ID
router.get('/:id', isAuthenticated, async (req, res) => {

    const { id } = req.params
    const post = await db.query('SELECT * FROM posts WHERE id = $1', [id])
    if (post.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' })
    }
    res.status(200).json(post.rows[0])

})

// POST /api/posts - Create a new post
router.post('/', isAuthenticated, async (req, res) => {
    const { authorId, content } = req.body

    if (!authorId || !content) {
        return res.status(400).json({ message: 'Author ID and content are required' })
    }

    const result = await db.query(
        'INSERT INTO posts (author_id, content) VALUES ($1, $2) RETURNING *',
        [authorId, content]
    )
    res.status(201).json(result.rows[0])

})

// PUT /api/posts/:id - Update post by ID
router.put('/:id', isAuthenticated, async (req, res) => {

    const { id } = req.params
    const { content } = req.body

    const exists = await db.query('SELECT * FROM posts WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' })
    }

    const result = await db.query(
        'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *',
        [content, id]
    )
    res.status(200).json(result.rows[0])

})

// DELETE /api/posts/:id - Delete post by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
    
    const { id } = req.params

    const exists = await db.query('SELECT * FROM posts WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' })
    }

    await db.query('DELETE FROM posts WHERE id = $1', [id])
    res.status(204).send()

})


// Likes Routes

// GET /api/posts/:id/likes - Get likes for a post
router.get('/:id/likes', isAuthenticated, async (req, res) => {
    
    const { id } = req.params
    const likes = await db.query('SELECT * FROM likes WHERE post_id = $1', [id])
    if (likes.rows.length === 0) {
        return res.status(404).json({ message: 'No likes found for this post' })
    }
    res.status(200).json(likes.rows)

})

// POST /api/posts/:id/likes - Like a post
router.post('/:id/likes', isAuthenticated, async (req, res) => {
    
    const { id } = req.params
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' })
    }

    const exists = await db.query('SELECT * FROM posts WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' })
    }

    const likeExists = await db.query('SELECT * FROM likes WHERE post_id = $1 AND user_id = $2', [id, userId])
    if (likeExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already liked this post' })
    }

    const result = await db.query(
        'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *',
        [id, userId]
    )
    res.status(201).json(result.rows[0])

})

// DELETE /api/posts/:id/likes/:userId - Unlike a post
router.delete('/:id/likes/:userId', isAuthenticated, async (req, res) => {
    
    const { id, userId } = req.params

    const exists = await db.query('SELECT * FROM posts WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' })
    }

    const likeExists = await db.query('SELECT * FROM likes WHERE post_id = $1 AND user_id = $2', [id, userId])
    if (likeExists.rows.length === 0) {
        return res.status(404).json({ message: 'Like not found' })
    }

    await db.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [id, userId])
    res.status(204).send()

})

// Attachments Routes

// GET /api/posts/:id/attachments - Get attachments for a post
router.get('/:id/attachments', isAuthenticated, async (req, res) => {
    
    const { id } = req.params
    const attachments = await db.query('SELECT * FROM post_attachments WHERE post_id = $1', [id])
    if (attachments.rows.length === 0) {
        return res.status(404).json({ message: 'No attachments found for this post' })
    }
    res.status(200).json(attachments.rows)

})

// POST /api/posts/:id/attachments - Add an attachment to a post
router.post('/:id/attachments', isAuthenticated, async (req, res) => {
    const { id } = req.params
    const { mediaId } = req.body

    if (!mediaId) {
        return res.status(400).json({ message: 'Media ID is required' })
    }

    const exists = await db.query('SELECT * FROM posts WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' })
    }

    const result = await db.query(
        'INSERT INTO post_attachments (post_id, media_id) VALUES ($1, $2) RETURNING *',
        [id, mediaId]
    )
    res.status(201).json(result.rows[0])

})

// DELETE /api/posts/:id/attachments/:mediaId - Remove an attachment from a post
router.delete('/:id/attachments/:mediaId', isAuthenticated, async (req, res) => {
    
    const { id, mediaId } = req.params

    const exists = await db.query('SELECT * FROM posts WHERE id = $1', [id])
    if (exists.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' })
    }

    const attachmentExists = await db.query('SELECT * FROM post_attachments WHERE post_id = $1 AND media_id = $2', [id, mediaId])
    if (attachmentExists.rows.length === 0) {
        return res.status(404).json({ message: 'Attachment not found' })
    }

    await db.query('DELETE FROM post_attachments WHERE post_id = $1 AND media_id = $2', [id, mediaId])
    res.status(204).send()

})

export default router
