CREATE DATABASE blog_db;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name) VALUES ('Technology'), ('Art'), ('Personal');
INSERT INTO posts (title, content, category_id)
VALUES ('This is my first post', 'This is test post', 1), ('Post about Art', 'This is art post! Wow!', 2);
INSERT INTO comments (content, post_id, author)
VALUES ('Excellent post!', 1, 'Guest'), ('Your art is great!', 1, 'Guest');