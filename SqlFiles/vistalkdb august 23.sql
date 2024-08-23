-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: vistalkdb
-- ------------------------------------------------------
-- Server version	8.4.0

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
-- Table structure for table `appsettings`
--

DROP TABLE IF EXISTS `appsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appsettings` (
  `userPlayerID` int NOT NULL,
  `bgID` int NOT NULL,
  `isMusicOn` bit(1) DEFAULT b'1',
  PRIMARY KEY (`userPlayerID`),
  KEY `bgID` (`bgID`),
  CONSTRAINT `appsettings_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `appsettings_ibfk_2` FOREIGN KEY (`bgID`) REFERENCES `backgroundmusic` (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appsettings`
--

LOCK TABLES `appsettings` WRITE;
/*!40000 ALTER TABLE `appsettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `appsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backgroundmusic`
--

DROP TABLE IF EXISTS `backgroundmusic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backgroundmusic` (
  `itemID` int NOT NULL,
  `musicTitle` varchar(100) NOT NULL,
  `musicGenre` varchar(50) NOT NULL,
  PRIMARY KEY (`itemID`),
  CONSTRAINT `backgroundmusic_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `item` (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backgroundmusic`
--

LOCK TABLES `backgroundmusic` WRITE;
/*!40000 ALTER TABLE `backgroundmusic` DISABLE KEYS */;
/*!40000 ALTER TABLE `backgroundmusic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coinbag`
--

DROP TABLE IF EXISTS `coinbag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coinbag` (
  `coinBagId` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `moneyPrice` decimal(10,2) NOT NULL,
  `coinBagName` varchar(50) NOT NULL,
  PRIMARY KEY (`coinBagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coinbag`
--

LOCK TABLES `coinbag` WRITE;
/*!40000 ALTER TABLE `coinbag` DISABLE KEYS */;
/*!40000 ALTER TABLE `coinbag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cointransaction`
--

DROP TABLE IF EXISTS `cointransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cointransaction` (
  `transactionID` int NOT NULL AUTO_INCREMENT,
  `userPlayerID` int NOT NULL,
  `coinBagID` int NOT NULL,
  `transactionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amountPaid` decimal(10,2) NOT NULL,
  PRIMARY KEY (`transactionID`),
  KEY `userPlayerID` (`userPlayerID`),
  KEY `coinBagID` (`coinBagID`),
  CONSTRAINT `cointransaction_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `cointransaction_ibfk_2` FOREIGN KEY (`coinBagID`) REFERENCES `coinbag` (`coinBagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cointransaction`
--

LOCK TABLES `cointransaction` WRITE;
/*!40000 ALTER TABLE `cointransaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `cointransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content` (
  `contentID` int NOT NULL AUTO_INCREMENT,
  `contentText` varchar(255) NOT NULL,
  `englishTranslation` varchar(255) NOT NULL,
  `audioPath` varchar(100) DEFAULT NULL,
  `languageID` int DEFAULT NULL,
  `contentTypeId` int DEFAULT NULL,
  PRIMARY KEY (`contentID`),
  KEY `languageID` (`languageID`),
  KEY `contentTypeId` (`contentTypeId`),
  CONSTRAINT `content_ibfk_1` FOREIGN KEY (`languageID`) REFERENCES `language` (`languageID`),
  CONSTRAINT `content_ibfk_2` FOREIGN KEY (`contentTypeId`) REFERENCES `contenttype` (`contentTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (3,'test','test','blob:http://localhost:5173/6822692e-7889-4052-8804-55bc9c52356b',1,2),(4,'test','test','blob:http://localhost:5173/6822692e-7889-4052-8804-55bc9c52356b',1,2),(5,'test','test','blob:http://localhost:5173/6822692e-7889-4052-8804-55bc9c52356b',1,2),(6,'test','test','blob:http://localhost:5173/6822692e-7889-4052-8804-55bc9c52356b',1,2),(7,'test32','testsdf32','sample-3s.mp3',1,2),(8,'test32','testsdf32','sample-3s.mp3',1,2),(9,'test32','testsdf32','sample-3s.mp3',1,2),(10,'test32','testsdf32','sample-3s.mp3',1,2),(13,'df','dsfg','',1,3),(14,'abcd','sadfd','',1,3),(15,'sadf','asdf','',1,1),(16,'sadfsdafsadfsdffgshd','sadf','',1,3),(18,'sdafsdaf','Goomodrnidgnsapfsdajkfnjjkdjknjksdnfkjljaslksd','',1,2),(19,'kjsadfhksdahf','kdsfjklsdaf','',1,1),(20,'zdfasldjf','jdlkfkjsadf','',1,3),(21,'6ty7u89i','ihsaf','',1,2),(36,'maayong buntag','Good morning','sample-6s.mp3',1,3),(37,'joshautestt','sdadf32','',1,3),(38,'joshautestt','sdadf32','',1,3),(39,'joshautestt','sdadf32','',1,3),(40,'joshautestt','sdadf32','',1,3),(41,'\'joshuagwapo','sadfsdf','sample-6s.mp3',1,3),(42,'dsfgdsfg34dsfg','dsfg','',1,3),(43,'5','er','',1,3),(44,'dfg','sdfg','sample-6s.mp3',1,1),(46,'joshuwaefsadfjsadjf','sdgfd','sample-6s.mp3',1,3);
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contentdefinition`
--

DROP TABLE IF EXISTS `contentdefinition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contentdefinition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contentID` int NOT NULL,
  `nativeDefinition` varchar(500) NOT NULL,
  `englishDefinition` varchar(500) DEFAULT NULL,
  `orderNumber` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contentID` (`contentID`),
  CONSTRAINT `contentdefinition_ibfk_1` FOREIGN KEY (`contentID`) REFERENCES `content` (`contentID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentdefinition`
--

LOCK TABLES `contentdefinition` WRITE;
/*!40000 ALTER TABLE `contentdefinition` DISABLE KEYS */;
INSERT INTO `contentdefinition` VALUES (1,3,'test2','test4',1),(2,4,'test2','test4',1),(3,5,'test2','test4',1),(4,6,'test2','test4',1),(5,7,'sadf','sdaf',1),(6,8,'sadf','sdaf',1);
/*!40000 ALTER TABLE `contentdefinition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contentexample`
--

DROP TABLE IF EXISTS `contentexample`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contentexample` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contentId` int NOT NULL,
  `nativeExample` varchar(500) DEFAULT NULL,
  `englishExample` varchar(500) DEFAULT NULL,
  `orderNumber` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contentId` (`contentId`),
  CONSTRAINT `contentexample_ibfk_1` FOREIGN KEY (`contentId`) REFERENCES `content` (`contentID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentexample`
--

LOCK TABLES `contentexample` WRITE;
/*!40000 ALTER TABLE `contentexample` DISABLE KEYS */;
INSERT INTO `contentexample` VALUES (1,3,'test5','test6',1),(2,4,'test5','test6',1),(3,5,'test5','test6',1),(4,6,'test5','test6',1);
/*!40000 ALTER TABLE `contentexample` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contentsyllable`
--

DROP TABLE IF EXISTS `contentsyllable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contentsyllable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contentId` int NOT NULL,
  `syllableText` varchar(20) DEFAULT NULL,
  `audioPath` varchar(500) DEFAULT NULL,
  `orderNumber` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contentId` (`contentId`),
  CONSTRAINT `contentsyllable_ibfk_1` FOREIGN KEY (`contentId`) REFERENCES `content` (`contentID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentsyllable`
--

LOCK TABLES `contentsyllable` WRITE;
/*!40000 ALTER TABLE `contentsyllable` DISABLE KEYS */;
INSERT INTO `contentsyllable` VALUES (1,40,'ma','sample-3s.mp3',1),(2,40,'waf','sample-3s.mp3',2);
/*!40000 ALTER TABLE `contentsyllable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenttype`
--

DROP TABLE IF EXISTS `contenttype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contenttype` (
  `contentTypeID` int NOT NULL AUTO_INCREMENT,
  `typeName` varchar(50) NOT NULL,
  PRIMARY KEY (`contentTypeID`),
  UNIQUE KEY `typeName` (`typeName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenttype`
--

LOCK TABLES `contenttype` WRITE;
/*!40000 ALTER TABLE `contenttype` DISABLE KEYS */;
INSERT INTO `contenttype` VALUES (3,'Phrase'),(2,'Sentence'),(1,'Word');
/*!40000 ALTER TABLE `contenttype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currentunitprogress`
--

DROP TABLE IF EXISTS `currentunitprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currentunitprogress` (
  `progressID` int NOT NULL AUTO_INCREMENT,
  `userPlayerID` int NOT NULL,
  `unitID` int NOT NULL,
  `progress` int NOT NULL DEFAULT '0',
  `life` int NOT NULL DEFAULT '3',
  `totalCorrectAnswers` int NOT NULL DEFAULT '0',
  `timer` int NOT NULL DEFAULT '15',
  `currentScore` int NOT NULL DEFAULT '0',
  `totalScore` int NOT NULL DEFAULT '0',
  `lastAccessed` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`progressID`),
  KEY `userPlayerID` (`userPlayerID`),
  KEY `unitID` (`unitID`),
  CONSTRAINT `currentunitprogress_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `currentunitprogress_ibfk_2` FOREIGN KEY (`unitID`) REFERENCES `unit` (`unitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currentunitprogress`
--

LOCK TABLES `currentunitprogress` WRITE;
/*!40000 ALTER TABLE `currentunitprogress` DISABLE KEYS */;
/*!40000 ALTER TABLE `currentunitprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dailytask`
--

DROP TABLE IF EXISTS `dailytask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dailytask` (
  `taskID` int NOT NULL AUTO_INCREMENT,
  `taskName` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  `rewardCoins` int NOT NULL,
  `taskDate` date NOT NULL,
  PRIMARY KEY (`taskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dailytask`
--

LOCK TABLES `dailytask` WRITE;
/*!40000 ALTER TABLE `dailytask` DISABLE KEYS */;
/*!40000 ALTER TABLE `dailytask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `itemID` int NOT NULL AUTO_INCREMENT,
  `itemTypeID` int NOT NULL,
  `vcoinPrice` int NOT NULL,
  `isPremium` bit(1) NOT NULL,
  `filePath` varchar(500) NOT NULL,
  PRIMARY KEY (`itemID`),
  KEY `itemTypeID` (`itemTypeID`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`itemTypeID`) REFERENCES `itemtype` (`itemTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itemtype`
--

DROP TABLE IF EXISTS `itemtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itemtype` (
  `itemTypeID` int NOT NULL AUTO_INCREMENT,
  `typeName` varchar(50) NOT NULL,
  PRIMARY KEY (`itemTypeID`),
  UNIQUE KEY `typeName` (`typeName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemtype`
--

LOCK TABLES `itemtype` WRITE;
/*!40000 ALTER TABLE `itemtype` DISABLE KEYS */;
/*!40000 ALTER TABLE `itemtype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `language` (
  `languageID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) DEFAULT NULL,
  `place` varchar(20) DEFAULT NULL,
  `native_name` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`languageID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES (1,'Sinugbuanong Bisaya','Cebu City','Cebuano','Example Description'),(2,'Hiligaynon','Ilo-Ilo City','Ilonggo','Example Description');
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playerdailytask`
--

DROP TABLE IF EXISTS `playerdailytask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playerdailytask` (
  `userPlayerID` int NOT NULL,
  `taskID` int NOT NULL,
  `isCompleted` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`userPlayerID`,`taskID`),
  KEY `taskID` (`taskID`),
  CONSTRAINT `playerdailytask_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `playerdailytask_ibfk_2` FOREIGN KEY (`taskID`) REFERENCES `dailytask` (`taskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playerdailytask`
--

LOCK TABLES `playerdailytask` WRITE;
/*!40000 ALTER TABLE `playerdailytask` DISABLE KEYS */;
/*!40000 ALTER TABLE `playerdailytask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `powerup`
--

DROP TABLE IF EXISTS `powerup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `powerup` (
  `itemID` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) NOT NULL,
  PRIMARY KEY (`itemID`),
  CONSTRAINT `powerup_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `item` (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `powerup`
--

LOCK TABLES `powerup` WRITE;
/*!40000 ALTER TABLE `powerup` DISABLE KEYS */;
/*!40000 ALTER TABLE `powerup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pronounciationresult`
--

DROP TABLE IF EXISTS `pronounciationresult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pronounciationresult` (
  `resultID` int NOT NULL AUTO_INCREMENT,
  `userPlayerID` int NOT NULL,
  `contentID` int NOT NULL,
  `pronunciationScore` float NOT NULL,
  PRIMARY KEY (`resultID`),
  KEY `userPlayerID` (`userPlayerID`),
  KEY `contentID` (`contentID`),
  CONSTRAINT `pronounciationresult_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `pronounciationresult_ibfk_2` FOREIGN KEY (`contentID`) REFERENCES `content` (`contentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pronounciationresult`
--

LOCK TABLES `pronounciationresult` WRITE;
/*!40000 ALTER TABLE `pronounciationresult` DISABLE KEYS */;
/*!40000 ALTER TABLE `pronounciationresult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase` (
  `purchaseID` int NOT NULL AUTO_INCREMENT,
  `userPlayerID` int NOT NULL,
  `itemID` int NOT NULL,
  `purchaseDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`purchaseID`),
  KEY `userPlayerID` (`userPlayerID`),
  KEY `itemID` (`itemID`),
  CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `item` (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `questionID` int NOT NULL AUTO_INCREMENT,
  `questionText` varchar(255) NOT NULL,
  `explanation` varchar(500) NOT NULL,
  `imagePath` varchar(500) DEFAULT NULL,
  `audioPath` varchar(500) DEFAULT NULL,
  `questionTypeID` int NOT NULL,
  PRIMARY KEY (`questionID`),
  KEY `questionTypeID` (`questionTypeID`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`questionTypeID`) REFERENCES `questiontype` (`typeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionchoice`
--

DROP TABLE IF EXISTS `questionchoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionchoice` (
  `questionChoiceID` int NOT NULL AUTO_INCREMENT,
  `questionID` int DEFAULT NULL,
  `languageID` int DEFAULT NULL,
  `unitId` int DEFAULT NULL,
  `correctChoice` varchar(100) DEFAULT NULL,
  `choice1` varchar(100) DEFAULT NULL,
  `choice3` varchar(100) DEFAULT NULL,
  `choice4` varchar(100) DEFAULT NULL,
  `choice2` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`questionChoiceID`),
  KEY `questionID` (`questionID`),
  KEY `languageID` (`languageID`),
  KEY `unitId` (`unitId`),
  CONSTRAINT `questionchoice_ibfk_1` FOREIGN KEY (`questionID`) REFERENCES `question` (`questionID`),
  CONSTRAINT `questionchoice_ibfk_2` FOREIGN KEY (`languageID`) REFERENCES `language` (`languageID`),
  CONSTRAINT `questionchoice_ibfk_3` FOREIGN KEY (`unitId`) REFERENCES `unit` (`unitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionchoice`
--

LOCK TABLES `questionchoice` WRITE;
/*!40000 ALTER TABLE `questionchoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionchoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questiontype`
--

DROP TABLE IF EXISTS `questiontype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questiontype` (
  `typeID` int NOT NULL AUTO_INCREMENT,
  `typeName` varchar(50) NOT NULL,
  PRIMARY KEY (`typeID`),
  UNIQUE KEY `typeName` (`typeName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questiontype`
--

LOCK TABLES `questiontype` WRITE;
/*!40000 ALTER TABLE `questiontype` DISABLE KEYS */;
INSERT INTO `questiontype` VALUES (1,'sampleTypeName');
/*!40000 ALTER TABLE `questiontype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section` (
  `sectionId` int NOT NULL AUTO_INCREMENT,
  `sectionNumber` int NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `isPremium` bit(1) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `languageID` int DEFAULT NULL,
  PRIMARY KEY (`sectionId`),
  KEY `section_language` (`languageID`),
  CONSTRAINT `section_language` FOREIGN KEY (`languageID`) REFERENCES `language` (`languageID`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
INSERT INTO `section` VALUES (27,12,'test12',_binary '\0','test section example',1),(28,23,'for hiligaynon test',_binary '\0','test',2);
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit` (
  `unitID` int NOT NULL AUTO_INCREMENT,
  `unitNumber` int NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `sectionID` int NOT NULL,
  `totalItems` int NOT NULL,
  PRIMARY KEY (`unitID`),
  KEY `sectionID` (`sectionID`),
  CONSTRAINT `unit_ibfk_1` FOREIGN KEY (`sectionID`) REFERENCES `section` (`sectionId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit`
--

LOCK TABLES `unit` WRITE;
/*!40000 ALTER TABLE `unit` DISABLE KEYS */;
INSERT INTO `unit` VALUES (1,1,'test12','testsdf',27,0),(2,2,'Unit 2','test 2',27,0),(3,3,'Unit 3','Test 3',27,0),(4,4,'Unit 4','testsdf',27,0),(5,5,'sdaf','dslajsf',27,0),(6,6,'dja','sadjklf',27,0),(7,7,'djkf','dfjl',27,0),(8,8,'sdkajf','adkjkf',27,0),(9,10,'dfag','sdflj',27,0),(10,9,'dfsg','esef',27,0),(11,11,'sdjioaf','sdafkj',27,0),(12,12,'dsakjf','sadflkjkj',27,0),(13,13,'sldkjaf','sdlfkj',27,0),(14,14,'SDJF','DFJL',27,0),(15,15,'ESWANN','123',27,0),(16,16,'JR','SDJLF',27,0),(17,1,'tes','sdf',28,0);
/*!40000 ALTER TABLE `unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `encryptedPassword` varchar(500) NOT NULL,
  `isActive` bit(1) NOT NULL,
  `isAdmin` bit(1) NOT NULL,
  `isPlayer` bit(1) NOT NULL,
  `isAccountLocked` bit(1) NOT NULL DEFAULT b'0',
  `failedLogins` int DEFAULT NULL,
  `logInTimeLockOut` datetime DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Admin','vistalk10101@gmail.com',NULL,'d6654413f18171dea31642b93dc58f84',_binary '',_binary '',_binary '\0',_binary '\0',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userfeedback`
--

DROP TABLE IF EXISTS `userfeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userfeedback` (
  `feedbackID` int NOT NULL AUTO_INCREMENT,
  `userPlayerID` int NOT NULL,
  `feedbackDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `feedbackText` varchar(1000) NOT NULL,
  `rating` int DEFAULT NULL,
  PRIMARY KEY (`feedbackID`),
  KEY `userPlayerID` (`userPlayerID`),
  CONSTRAINT `userfeedback_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `userfeedback_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userfeedback`
--

LOCK TABLES `userfeedback` WRITE;
/*!40000 ALTER TABLE `userfeedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `userfeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useritem`
--

DROP TABLE IF EXISTS `useritem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useritem` (
  `userPlayerID` int NOT NULL,
  `itemID` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`userPlayerID`,`itemID`),
  KEY `itemID` (`itemID`),
  CONSTRAINT `useritem_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `useritem_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `item` (`itemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useritem`
--

LOCK TABLES `useritem` WRITE;
/*!40000 ALTER TABLE `useritem` DISABLE KEYS */;
/*!40000 ALTER TABLE `useritem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userplayer`
--

DROP TABLE IF EXISTS `userplayer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userplayer` (
  `userPlayerId` int NOT NULL,
  `vCoin` int NOT NULL DEFAULT '0',
  `totalScoreWeekly` int NOT NULL DEFAULT '0',
  `isPremium` bit(1) NOT NULL DEFAULT b'0',
  `premiumExpiry` datetime DEFAULT NULL,
  `currentLanguageId` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`userPlayerId`),
  KEY `currentLanguageId` (`currentLanguageId`),
  CONSTRAINT `userplayer_ibfk_1` FOREIGN KEY (`currentLanguageId`) REFERENCES `language` (`languageID`),
  CONSTRAINT `userplayer_ibfk_2` FOREIGN KEY (`userPlayerId`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userplayer`
--

LOCK TABLES `userplayer` WRITE;
/*!40000 ALTER TABLE `userplayer` DISABLE KEYS */;
/*!40000 ALTER TABLE `userplayer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userunit`
--

DROP TABLE IF EXISTS `userunit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userunit` (
  `userUnitID` int NOT NULL AUTO_INCREMENT,
  `userPlayerID` int NOT NULL,
  `unitID` int NOT NULL,
  `totalCorrectAnswers` int NOT NULL DEFAULT '0',
  `ViStars` int NOT NULL DEFAULT '0',
  `totalScore` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`userUnitID`),
  KEY `userPlayerID` (`userPlayerID`),
  KEY `unitID` (`unitID`),
  CONSTRAINT `userunit_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `userplayer` (`userPlayerId`),
  CONSTRAINT `userunit_ibfk_2` FOREIGN KEY (`unitID`) REFERENCES `unit` (`unitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userunit`
--

LOCK TABLES `userunit` WRITE;
/*!40000 ALTER TABLE `userunit` DISABLE KEYS */;
/*!40000 ALTER TABLE `userunit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-23 10:28:25
