import express from 'express'
import db from '../db.js'
const router = express.Router()

// Chats API routes

// Get all chats for a specific user
router.get('/user/:user_id', async (req, res) => {
    const { user_id } = req.params
    try {
        const chats = await db.query('SELECT * FROM chats WHERE user_id = $1', [user_id])
        if (chats.rows.length === 0) {
            return res.status(404).json({ message: 'No chats found for this user' })
        }
        res.status(200).json(chats.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Get a specific chat by ID
router.get('/:chat_id', async (req, res) => {
    const { chat_id } = req.params
    try {
        const chat = await db.query('SELECT * FROM chats WHERE id = $1', [chat_id])
        if (chat.rows.length === 0) {
            return res.status(404).json({ message: 'Chat not found' })
        }
        res.status(200).json(chat.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Create a new chat for two users
router.post('/', async (req, res) => {
    const { user1_id, user2_id } = req.body

    if (!user1_id || !user2_id) {
        return res.status(400).json({ message: 'Both user IDs are required' })
    }

    try {
        const newChat = await db.query(
            'INSERT INTO chats (user1_id, user2_id) VALUES ($1, $2) RETURNING *',
            [user1_id, user2_id]
        )
        res.status(201).json(newChat.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Delete a specific chat
router.delete('/:chat_id', async (req, res) => {
    const { chat_id } = req.params

    try {
        const result = await db.query('DELETE FROM chats WHERE id = $1 RETURNING *', [chat_id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Chat not found' })
        }
        res.status(200).json({ message: 'Chat deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Messages API routes

// Get all messages in a specific chat
router.get('/:chat_id/messages', async (req, res) => {
    const { chat_id } = req.params
    try {
        const messages = await db.query('SELECT * FROM messages WHERE chat_id = $1', [chat_id])
        if (messages.rows.length === 0) {
            return res.status(404).json({ message: 'No messages found in this chat' })
        }
        res.status(200).json(messages.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Create a new message in a specific chat
router.post('/:chat_id/messages', async (req, res) => {
    const { chat_id } = req.params
    const { user_id, content } = req.body

    if (!user_id || !content) {
        return res.status(400).json({ message: 'User ID and content are required' })
    }

    try {
        const newMessage = await db.query(
            'INSERT INTO messages (chat_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [chat_id, user_id, content]
        )
        res.status(201).json(newMessage.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Delete a specific message
router.delete('/:chat_id/messages/:message_id', async (req, res) => {
    const { message_id } = req.params

    try {
        const result = await db.query('DELETE FROM messages WHERE id = $1 RETURNING *', [message_id])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Message not found' })
        }
        res.status(200).json({ message: 'Message deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Update a specific message
router.put('/:chat_id/messages/:message_id', async (req, res) => {
    const { message_id } = req.params
    const { content } = req.body

    if (!content) {
        return res.status(400).json({ message: 'Content is required' })
    }

    try {
        const updatedMessage = await db.query(
            'UPDATE messages SET content = $1 WHERE id = $2 RETURNING *',
            [content, message_id]
        )
        if (updatedMessage.rows.length === 0) {
            return res.status(404).json({ message: 'Message not found' })
        }
        res.status(200).json(updatedMessage.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

export default router
