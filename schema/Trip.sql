-- Copyright 2010 TripShare
--
-- Licensed under the Apache License, Version 2.0 (the "License"); you may
-- not use this file except in compliance with the License. You may obtain
-- a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
-- WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
-- License for the specific language governing permissions and limitations
-- under the License.

-- To create the database:
--   CREATE DATABASE blog;
--   GRANT ALL PRIVILEGES ON blog.* TO 'blog'@'localhost' IDENTIFIED BY 'blog';
--
-- To reload the tables:
--   mysql --user=blog --password=blog --database=blog < schema.sql

SET SESSION storage_engine = "InnoDB";
SET SESSION time_zone = "+0:00";
ALTER DATABASE CHARACTER SET "utf8";

DROP TABLE IF EXISTS Trips;
CREATE TABLE Trips (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL REFERENCES users(id),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(512) NOT NULL,
    startPlace VARCHAR(512) NOT NULL,
    destPlace  VARCHAR(512) NOT NULL,
    tripPath  VARCHAR(512) NULL,
    description TEXT NOT NULL,
    privacy BOOLEAN NOT NULL,
    published DATETIME NOT NULL,
    updated TIMESTAMP NOT NULL,
    image BLOB, 
    KEY (published)
);

