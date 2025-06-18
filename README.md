# Zamoor API

A RESTful API for the Zamoor social platform.

## Authentication

### User Auth

- `POST /api/auth/signup`  
  Create a new user.  
  **Body:** `{ email, password }`

- `POST /api/auth/login`  
  Login as a user.  
  **Body:** `{ email, password }`

### Admin Auth

- `POST /api/admin/auth/register`  
  Register a new admin (must be invoked by an existing admin).  
  **Body:** `{ admin_id, email, password }`

- `POST /api/admin/auth/login`  
  Login as an admin.  
  **Body:** `{ email, password }`

---

## Users

- `GET /api/users`  
  Get all users.

- `GET /api/users/:id`  
  Get user by ID.

- `POST /api/users`  
  Create a new user.  
  **Body:** `{ email, username, password }`

- `PUT /api/users/:id`  
  Update user by ID.  
  **Body:** `{ email, username, password }`

- `DELETE /api/users/:id`  
  Delete user by ID.

### Followers

- `GET /api/users/:id/followers`  
  Get followers of a user.

- `GET /api/users/:id/following`  
  Get users a user is following.

- `POST /api/users/:id/follow`  
  Follow a user.  
  **Body:** `{ userId }`

- `DELETE /api/users/:id/unfollow`  
  Unfollow a user.  
  **Body:** `{ userId }`

---

## Posts

- `GET /api/posts`  
  Get all posts.

- `GET /api/posts/:id`  
  Get post by ID.

- `POST /api/posts`  
  Create a new post.  
  **Body:** `{ authorId, content }`

- `PUT /api/posts/:id`  
  Update post by ID.  
  **Body:** `{ content }`

- `DELETE /api/posts/:id`  
  Delete post by ID.

### Post Likes

- `GET /api/posts/:id/likes`  
  Get likes for a post.

- `POST /api/posts/:id/likes`  
  Like a post.  
  **Body:** `{ userId }`

- `DELETE /api/posts/:id/likes/:userId`  
  Unlike a post.

### Post Attachments

- `GET /api/posts/:id/attachments`  
  Get attachments for a post.

- `POST /api/posts/:id/attachments`  
  Add attachment to a post.  
  **Body:** `{ mediaId }`

- `DELETE /api/posts/:id/attachments/:mediaId`  
  Remove attachment from a post.

---

## Comments

- `GET /api/comments/:post_id`  
  Get all comments for a post.

- `POST /api/comments/:post_id`  
  Add a comment to a post.  
  **Body:** `{ content, author }`

- `DELETE /api/comments/:comment_id`  
  Delete a comment.

### Comment Likes

- `GET /api/comments/:comment_id/likes`  
  Get likes for a comment.

- `POST /api/comments/:comment_id/likes`  
  Like a comment.  
  **Body:** `{ user_id }`

- `DELETE /api/comments/:comment_id/likes/:like_id`  
  Remove like from a comment.

---

## Replies

- `GET /api/replies/:comment_id`  
  Get all replies for a comment.

- `POST /api/replies/:comment_id`  
  Add a reply to a comment.  
  **Body:** `{ content, author }`

- `DELETE /api/replies/:reply_id`  
  Delete a reply.

### Reply Likes

- `GET /api/replies/:reply_id/likes`  
  Get likes for a reply.

- `POST /api/replies/:reply_id/likes`  
  Like a reply.  
  **Body:** `{ user_id }`

- `DELETE /api/replies/:reply_id/likes/:like_id`  
  Remove like from a reply.

---

## Notifications

- `GET /api/notifications/:user_id`  
  Get notifications for a user.

- `POST /api/notifications/:user_id`  
  Create a notification for a user.  
  **Body:** `{ type, message }`

- `PUT /api/notifications/:notification_id`  
  Update notification read status.  
  **Body:** `{ read }`

- `DELETE /api/notifications/:notification_id`  
  Delete a notification.

---

## Media

- `GET /api/media`  
  Root endpoint for media.

---

## Chats

- `GET /api/chats/user/:user_id`  
  Get all chats for a user.

- `GET /api/chats/:chat_id`  
  Get a chat by ID.

- `POST /api/chats`  
  Create a new chat between two users.  
  **Body:** `{ user1_id, user2_id }`

- `DELETE /api/chats/:chat_id`  
  Delete a chat.

### Messages

- `GET /api/chats/:chat_id/messages`  
  Get all messages in a chat.

- `POST /api/chats/:chat_id/messages`  
  Add a message to a chat.  
  **Body:** `{ user_id, content }`

- `DELETE /api/chats/:chat_id/messages/:message_id`  
  Delete a message.

- `PUT /api/chats/:chat_id/messages/:message_id`  
  Update a message.  
  **Body:** `{ content }`
  