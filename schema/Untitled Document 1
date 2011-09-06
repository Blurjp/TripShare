SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `TripShare` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `TripShare` ;

-- -----------------------------------------------------
-- Table `TripShare`.`country`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`country` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`country` (
  `country_id` INT NOT NULL ,
  `country` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`country_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TripShare`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`users` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`users` (
  `user_id` BINARY(16) NOT NULL ,
  `username` VARCHAR(45) NOT NULL ,
  `password` VARCHAR(45) NOT NULL ,
  `email` VARCHAR(45) NOT NULL ,
  `picture` VARCHAR(45) NOT NULL ,
  `status` VARCHAR(45) NOT NULL ,
  `created_at` DATETIME NOT NULL ,
  `country_country_id` INT NOT NULL ,
  PRIMARY KEY (`user_id`) ,
  INDEX `fk_users_country1` (`country_country_id` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) ,
  CONSTRAINT `fk_users_country1`
    FOREIGN KEY (`country_country_id` )
    REFERENCES `TripShare`.`country` (`country_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TripShare`.`friends`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`friends` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`friends` (
  `friend_id` BINARY(16) NOT NULL ,
  `friend_user_id` BINARY(16) NOT NULL ,
  PRIMARY KEY (`friend_id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TripShare`.`profile`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`profile` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`profile` (
  `profile_id` INT NOT NULL ,
  `hobbies` VARCHAR(45) NULL ,
  `users_user_id` BINARY(16) NOT NULL ,
  PRIMARY KEY (`profile_id`) ,
  INDEX `fk_profile_users1` (`users_user_id` ASC) ,
  CONSTRAINT `fk_profile_users1`
    FOREIGN KEY (`users_user_id` )
    REFERENCES `TripShare`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TripShare`.`trips`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`trips` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`trips` (
  `trip_id` BINARY(16) NOT NULL ,
  `start_place` VARCHAR(45) NOT NULL ,
  `dest_place` VARCHAR(45) NOT NULL ,
  `privacy` TINYINT NOT NULL ,
  `description` VARCHAR(45) NULL ,
  `trip_path` VARCHAR(255) NULL DEFAULT NULL ,
  `title` VARCHAR(45) NOT NULL ,
  `slug` VARCHAR(45) NOT NULL ,
  `published` DATETIME NOT NULL ,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  PRIMARY KEY (`trip_id`) ,
  UNIQUE INDEX `slug_UNIQUE` (`slug` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TripShare`.`users_has_trips`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`users_has_trips` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`users_has_trips` (
  `users_user_id` BINARY(16) NOT NULL ,
  `trips_trip_id` BINARY(16) NOT NULL ,
  `permission` TINYINT NOT NULL ,
  `description` VARCHAR(45) NULL ,
  INDEX `fk_users_has_trip_trip1` (`trips_trip_id` ASC) ,
  INDEX `fk_users_has_trip_users` (`users_user_id` ASC) ,
  CONSTRAINT `fk_users_has_trip_users`
    FOREIGN KEY (`users_user_id` )
    REFERENCES `TripShare`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_trip_trip1`
    FOREIGN KEY (`trips_trip_id` )
    REFERENCES `TripShare`.`trips` (`trip_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TripShare`.`users_has_friends`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`users_has_friends` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`users_has_friends` (
  `users_user_id` BINARY(16) NOT NULL ,
  `friends_friend_id` BINARY(16) NOT NULL ,
  INDEX `fk_users_has_friends_friends1` (`friends_friend_id` ASC) ,
  INDEX `fk_users_has_friends_users1` (`users_user_id` ASC) ,
  CONSTRAINT `fk_users_has_friends_users1`
    FOREIGN KEY (`users_user_id` )
    REFERENCES `TripShare`.`users` (`user_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_friends_friends1`
    FOREIGN KEY (`friends_friend_id` )
    REFERENCES `TripShare`.`friends` (`friend_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TripShare`.`city`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `TripShare`.`city` ;

CREATE  TABLE IF NOT EXISTS `TripShare`.`city` (
  `city_id` INT NOT NULL ,
  `city` VARCHAR(45) NOT NULL ,
  `country_country_id` INT NOT NULL ,
  PRIMARY KEY (`city_id`) ,
  INDEX `fk_city_country1` (`country_country_id` ASC) ,
  CONSTRAINT `fk_city_country1`
    FOREIGN KEY (`country_country_id` )
    REFERENCES `TripShare`.`country` (`country_id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

