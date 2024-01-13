-- Migration number: 0000 	 2023-12-24T13:37:44.089Z
CREATE TABLE articles (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `key` TEXT UNIQUE NOT NULL,
  `title` TEXT NOT NULL,
  `abstract` TEXT NOT NULL,
  `body` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX articles_key_uindex ON articles (key);
CREATE INDEX articles_created_at_index ON articles (created_at);
