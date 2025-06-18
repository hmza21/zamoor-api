-- Insert media
INSERT INTO media (path, type) VALUES
  ('/media/user1_icon.png', 'image/png'),
  ('/media/user2_icon.jpg', 'image/jpeg'),
  ('/media/user1_banner.jpg', 'image/jpeg'),
  ('/media/user2_banner.png', 'image/png');

-- Insert users
INSERT INTO users (username, email, password, icon, banner, quote, color1, color2, darkmode)
VALUES
  ('alice', 'alice@example.com', 'hashedpassword1', '/media/user1_icon.png', '/media/user1_banner.jpg', 'Keep moving forward.', '#ff5733', '#33c1ff', TRUE),
  ('bob', 'bob@example.com', 'hashedpassword2', '/media/user2_icon.jpg', '/media/user2_banner.png', 'Carpe diem!', '#33ff57', '#ff33a6', FALSE);

-- Insert followers
INSERT INTO user_followers (user_id, follower_id) VALUES
  (1, 2), -- Bob follows Alice
  (2, 1); -- Alice follows Bob

-- Insert posts
INSERT INTO posts (author_id, content) VALUES
  (1, 'Hello, this is Alice''s first post!'),
  (2, 'Hey, Bob here. Excited to join Zamoor!');

-- Insert post likes
INSERT INTO post_likes (post_id, user_id) VALUES
  (1, 2), -- Bob likes Alice's post
  (2, 1); -- Alice likes Bob's post

-- Insert post attachments
INSERT INTO post_attachments (post_id, media_path) VALUES
  (1, '/media/user1_banner.jpg'),
  (2, '/media/user2_banner.png');

-- Insert comments
INSERT INTO comments (post_id, author_id, content) VALUES
  (1, 2, 'Nice post, Alice!'),
  (2, 1, 'Welcome, Bob!');

-- Insert comment likes
INSERT INTO comment_likes (comment_id, user_id) VALUES
  (1, 1), -- Alice likes Bob's comment
  (2, 2); -- Bob likes Alice's comment

-- Insert replies
INSERT INTO replies (comment_id, author_id, content) VALUES
  (1, 1, 'Thanks Bob!'),
  (2, 2, 'Thank you Alice!');

-- Insert reply likes
INSERT INTO reply_likes (reply_id, user_id) VALUES
  (1, 2),
  (2, 1);

-- Insert notifications
INSERT INTO notifications (user_id, title, content, type)
VALUES
  (1, 'Welcome!', 'Thanks for joining Zamoor, Alice!', 'welcome'),
  (2, 'Welcome!', 'Thanks for joining Zamoor, Bob!', 'welcome');

-- Insert chats
INSERT INTO chats DEFAULT VALUES;

-- Insert chat users (Alice and Bob in one chat)
INSERT INTO chat_users (chat_id, user_id) VALUES
  (1, 1),
  (1, 2);

-- Insert messages
INSERT INTO messages (chat_id, sender_id, content) VALUES
  (1, 1, 'Hi Bob!'),
  (1, 2, 'Hey Alice!');