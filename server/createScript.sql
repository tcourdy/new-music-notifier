use spotify_db;

create table if not exists phoneVerification(
       phoneNumber int unsigned not null,
       pin int unsigned not null
) engine=innodb;

create table if not exists users (
       userID int unsigned auto_increment primary key,
       phoneNumber int unsigned not null unique,
       password char(64) not null -- use sha256 hashing for password
) engine=innodb;

-- create table if not exists artists (
--        spotifyArtistID varchar(255) primary key,
--        spotifyArtistName varchar(255) not null
-- ) engine=innodb;

create table if not exists followedArtists(
       id int unsigned auto_increment primary key,
       spotifyArtistID varchar(255) not null,
       userID int unsigned,

       foreign key(userID)
               references users(userID)
) engine=innodb;
