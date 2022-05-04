CREATE DATABASE  IF NOT EXISTS `oplogicdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `oplogicdb`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: oplogicdb
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit`
--

DROP TABLE IF EXISTS `audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `auditMessageId` bigint DEFAULT NULL,
  `auditChangedById` bigint DEFAULT NULL,
  `oldValue` varchar(2000) DEFAULT NULL,
  `newValue` varchar(2000) DEFAULT NULL,
  `action` enum('Edited','Deleted') DEFAULT NULL,
  `changeDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `auditMessageId` (`auditMessageId`),
  KEY `auditChangedById` (`auditChangedById`),
  CONSTRAINT `auditChangedById` FOREIGN KEY (`auditChangedById`) REFERENCES `user` (`id`),
  CONSTRAINT `auditMessageId` FOREIGN KEY (`auditMessageId`) REFERENCES `message` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `channel`
--

DROP TABLE IF EXISTS `channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `channel` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `isPrivate` tinyint(1) DEFAULT NULL,
  `isDirectMessage` tinyint(1) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `timeCreated` datetime DEFAULT NULL,
  `isDeleted` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `pkindex` int NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `address` varchar(80) NOT NULL,
  `phoneNumber` varchar(18) NOT NULL,
  `email` varchar(40) NOT NULL,
  `make` varchar(25) NOT NULL,
  `model` varchar(25) NOT NULL,
  PRIMARY KEY (`pkindex`),
  UNIQUE KEY `pkindex_UNIQUE` (`pkindex`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `filedata`
--

DROP TABLE IF EXISTS `filedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filedata` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fileDataSenderId` bigint DEFAULT NULL,
  `fileDataChannelId` bigint DEFAULT NULL,
  `fileDataMessageId` bigint DEFAULT NULL,
  `timeSent` datetime DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `data` longblob,
  PRIMARY KEY (`id`),
  KEY `fileDataSenderId_idx` (`fileDataSenderId`),
  KEY `fileDataChannelId_idx` (`fileDataChannelId`),
  KEY `fileDataMessageId_idx` (`fileDataMessageId`),
  CONSTRAINT `fileDataChannelId` FOREIGN KEY (`fileDataChannelId`) REFERENCES `channel` (`id`),
  CONSTRAINT `fileDataMessageId` FOREIGN KEY (`fileDataMessageId`) REFERENCES `message` (`id`),
  CONSTRAINT `fileDataSenderId` FOREIGN KEY (`fileDataSenderId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `membership`
--

DROP TABLE IF EXISTS `membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `isChannelAdmin` tinyint(1) NOT NULL,
  `membershipChannelId` bigint NOT NULL,
  `membershipUserId` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `membershipChannelId` (`membershipChannelId`),
  KEY `membershipUserId` (`membershipUserId`),
  CONSTRAINT `membershipChannelId` FOREIGN KEY (`membershipChannelId`) REFERENCES `channel` (`id`),
  CONSTRAINT `membershipUserId` FOREIGN KEY (`membershipUserId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `messageSenderId` bigint DEFAULT NULL,
  `messageChannelId` bigint DEFAULT NULL,
  `timeSent` datetime DEFAULT NULL,
  `isDeleted` tinyint DEFAULT NULL,
  `isEdited` tinyint DEFAULT NULL,
  `message` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `messageSenderId` (`messageSenderId`),
  KEY `messageChannelId` (`messageChannelId`),
  CONSTRAINT `messageChannelId` FOREIGN KEY (`messageChannelId`) REFERENCES `channel` (`id`),
  CONSTRAINT `messageSenderId` FOREIGN KEY (`messageSenderId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=558 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `notificationUserIdSender` bigint DEFAULT NULL,
  `notificationUserIdReceiver` bigint DEFAULT NULL,
  `notificationChannelId` bigint DEFAULT NULL,
  `viewed` tinyint DEFAULT NULL,
  `timeSent` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notificationUserIdSender_idx` (`notificationUserIdSender`),
  KEY `notificationUserIdReceiver_idx` (`notificationUserIdReceiver`),
  KEY `notificationChannelId_idx` (`notificationChannelId`),
  CONSTRAINT `notificationChannelId` FOREIGN KEY (`notificationChannelId`) REFERENCES `channel` (`id`),
  CONSTRAINT `notificationUserIdReceiver` FOREIGN KEY (`notificationUserIdReceiver`) REFERENCES `user` (`id`),
  CONSTRAINT `notificationUserIdSender` FOREIGN KEY (`notificationUserIdSender`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reference`
--

DROP TABLE IF EXISTS `reference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reference` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `referenceCustomerId` int DEFAULT NULL,
  `referenceChannelId` bigint DEFAULT NULL,
  `firstName` varchar(40) DEFAULT NULL,
  `lastName` varchar(40) DEFAULT NULL,
  `address` varchar(80) DEFAULT NULL,
  `phoneNumber` varchar(18) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `make` varchar(25) DEFAULT NULL,
  `model` varchar(25) DEFAULT NULL,
  `timeSent` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `referenceChannelId_idx` (`referenceChannelId`),
  KEY `referenceCustomerId_idx` (`referenceCustomerId`),
  CONSTRAINT `referenceChannelId` FOREIGN KEY (`referenceChannelId`) REFERENCES `channel` (`id`),
  CONSTRAINT `referenceCustomerId` FOREIGN KEY (`referenceCustomerId`) REFERENCES `customer` (`pkindex`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `settingsUserId` bigint NOT NULL,
  `disableAllNotifications` tinyint(1) DEFAULT NULL,
  `badgeEnabled` tinyint(1) DEFAULT NULL,
  `soundEnabled` tinyint(1) DEFAULT NULL,
  `previewEnabled` tinyint(1) DEFAULT NULL,
  `notifyOnDirectMessage` tinyint(1) DEFAULT NULL,
  `notifyOnMention` tinyint(1) DEFAULT NULL,
  `notifyOnEmail` tinyint(1) DEFAULT NULL,
  `notifyOnSMS` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settingsUserId_UNIQUE` (`settingsUserId`),
  CONSTRAINT `settingsUserId` FOREIGN KEY (`settingsUserId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `displayName` varchar(50) DEFAULT NULL,
  `fullName` varchar(50) DEFAULT NULL,
  `profileImage` blob,
  `email` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `userStatus` tinyint DEFAULT NULL,
  `isSystemAdmin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-11 11:53:15
