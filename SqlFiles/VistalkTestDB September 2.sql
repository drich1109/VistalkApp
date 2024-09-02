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
  CONSTRAINT `appsettings_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
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
  CONSTRAINT `cointransaction_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
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
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`contentID`),
  KEY `languageID` (`languageID`),
  KEY `contentTypeId` (`contentTypeId`),
  CONSTRAINT `content_ibfk_1` FOREIGN KEY (`languageID`) REFERENCES `language` (`languageID`),
  CONSTRAINT `content_ibfk_2` FOREIGN KEY (`contentTypeId`) REFERENCES `contenttype` (`contentTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (72,'Gwapo','Handsome','Gwapo.mp3',1,1,_binary ''),(73,'Gwapa','Beautiful','Gwapa.mp3',1,2,_binary ''),(74,'Maayo','Very Good','Maayo.mp3',1,3,_binary ''),(75,'Kanta','Sing','Kanta.mp3',1,1,_binary ''),(76,'Gwa','sdaf','Gwa.mp3',1,3,_binary ''),(79,'gwaping','sadf','gwaping.mp3',1,2,_binary ''),(80,'gwapogs','sdafsadf','gwapogs.mp3',1,2,_binary ''),(81,'gwapo kaayo','sadf','gwapo_kaayo.mp3',1,3,_binary ''),(82,'gwapa si aby','sadfsadfg','gwapa_si_aby.mp3',1,2,_binary ''),(83,'gwapo2x','sadfsadf','gwapo2x.mp3',1,2,_binary ''),(84,'gwaposdfasdf','adsfgasdf','gwaposdfasdf.mp3',1,3,_binary ''),(85,'gwapokaayo','sadfasdf','gwapokaayo.mp3',1,2,_binary ''),(86,'gwapinhssdaf','sadfsadf','gwapinhssdaf.mp3',1,1,_binary ''),(87,'gwaopagwapa','sadf','gwaopagwapa.mp3',1,1,_binary ''),(88,'gwaopisdaf','dlkasjf','gwaopisdaf.mp3',1,1,_binary ''),(89,'gwaposakhjdfg','kjshadf','gwaposakhjdfg.mp3',1,3,_binary ''),(90,'test23','sdfa','test23.mp3',1,1,_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentdefinition`
--

LOCK TABLES `contentdefinition` WRITE;
/*!40000 ALTER TABLE `contentdefinition` DISABLE KEYS */;
INSERT INTO `contentdefinition` VALUES (8,72,'Nindot og pangitsura','a beautiful face of a man',1),(9,73,'nindot og nawng','pretty structured face',1),(10,74,'kamao','skillful',1),(11,75,'motingog nga naay tono','to speak having a tone',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentexample`
--

LOCK TABLES `contentexample` WRITE;
/*!40000 ALTER TABLE `contentexample` DISABLE KEYS */;
INSERT INTO `contentexample` VALUES (6,72,'Ako kay gwapo.','Justin Beiber is handsome',1),(7,73,'Gwapa kaayo si aby','Aby is so pretty',1),(8,74,'maayo kaayo siya mo kanta','That person is a very good singer.',1),(9,75,'Nikanta siya og bisaya nga kanta','That person sings a Visayan song',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentsyllable`
--

LOCK TABLES `contentsyllable` WRITE;
/*!40000 ALTER TABLE `contentsyllable` DISABLE KEYS */;
INSERT INTO `contentsyllable` VALUES (9,72,'gu','sample-3s.mp3',1),(10,72,'wa','sample-3s.mp3',2),(11,72,'po','sample-3s.mp3',3),(12,73,'Gu','Gu',1),(13,73,'wa','wa',2),(14,73,'pa','pa',3),(15,74,'Ma','Ma.mp3',1),(16,74,'a','a.mp3',2),(17,74,'yo','yo.mp3',3),(18,75,'kan','kan.mp3',1),(19,75,'ta','ta.mp3',2);
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
  CONSTRAINT `currentunitprogress_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
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
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`itemID`),
  KEY `itemTypeID` (`itemTypeID`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`itemTypeID`) REFERENCES `itemtype` (`itemTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,1,1,_binary '','dsfg.png',_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itemtype`
--

LOCK TABLES `itemtype` WRITE;
/*!40000 ALTER TABLE `itemtype` DISABLE KEYS */;
INSERT INTO `itemtype` VALUES (2,'Background Music'),(3,'Coin Bag'),(1,'Power Up');
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
  CONSTRAINT `playerdailytask_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
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
INSERT INTO `powerup` VALUES (1,'dsfg','asdf');
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
  CONSTRAINT `pronounciationresult_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
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
  CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
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
  `imagePath` varchar(500) DEFAULT NULL,
  `audioPath` varchar(500) DEFAULT NULL,
  `questionTypeID` int NOT NULL,
  `unitId` int DEFAULT NULL,
  `isActive` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`questionID`),
  KEY `questionTypeID` (`questionTypeID`),
  KEY `fk_question_unit` (`unitId`),
  CONSTRAINT `fk_question_unit` FOREIGN KEY (`unitId`) REFERENCES `unit` (`unitID`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`questionTypeID`) REFERENCES `questiontype` (`typeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'knsay gwapo',NULL,NULL,2,2,_binary ''),(2,'knsay gwapo','2_Untitled design.png',NULL,2,2,_binary ''),(3,'sadfsadf',NULL,NULL,3,1,_binary '');
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
  `questionID` int NOT NULL,
  `correctChoice` int DEFAULT NULL,
  `choice1` int DEFAULT NULL,
  `choice2` int DEFAULT NULL,
  `choice3` int DEFAULT NULL,
  `choice4` int DEFAULT NULL,
  PRIMARY KEY (`questionChoiceID`),
  KEY `correctChoice` (`correctChoice`),
  KEY `choice1` (`choice1`),
  KEY `choice2` (`choice2`),
  KEY `choice3` (`choice3`),
  KEY `choice4` (`choice4`),
  KEY `questionID` (`questionID`),
  CONSTRAINT `questionchoice_ibfk_1` FOREIGN KEY (`correctChoice`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionchoice_ibfk_2` FOREIGN KEY (`choice1`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionchoice_ibfk_3` FOREIGN KEY (`choice2`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionchoice_ibfk_4` FOREIGN KEY (`choice3`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionchoice_ibfk_5` FOREIGN KEY (`choice4`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionchoice_ibfk_6` FOREIGN KEY (`questionID`) REFERENCES `question` (`questionID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionchoice`
--

LOCK TABLES `questionchoice` WRITE;
/*!40000 ALTER TABLE `questionchoice` DISABLE KEYS */;
INSERT INTO `questionchoice` VALUES (1,2,82,73,72,74,82);
/*!40000 ALTER TABLE `questionchoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionmatchingtype`
--

DROP TABLE IF EXISTS `questionmatchingtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionmatchingtype` (
  `questionMatchingTypeID` int NOT NULL AUTO_INCREMENT,
  `questionID` int NOT NULL,
  `word1` int DEFAULT NULL,
  `match1` int DEFAULT NULL,
  `word2` int DEFAULT NULL,
  `match2` int DEFAULT NULL,
  `word3` int DEFAULT NULL,
  `match3` int DEFAULT NULL,
  `word4` int DEFAULT NULL,
  `match4` int DEFAULT NULL,
  PRIMARY KEY (`questionMatchingTypeID`),
  KEY `word1` (`word1`),
  KEY `match1` (`match1`),
  KEY `word2` (`word2`),
  KEY `match2` (`match2`),
  KEY `word3` (`word3`),
  KEY `match3` (`match3`),
  KEY `word4` (`word4`),
  KEY `match4` (`match4`),
  KEY `questionID` (`questionID`),
  CONSTRAINT `questionmatchingtype_ibfk_1` FOREIGN KEY (`word1`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_2` FOREIGN KEY (`match1`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_3` FOREIGN KEY (`word2`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_4` FOREIGN KEY (`match2`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_5` FOREIGN KEY (`word3`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_6` FOREIGN KEY (`match3`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_7` FOREIGN KEY (`word4`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_8` FOREIGN KEY (`match4`) REFERENCES `content` (`contentID`),
  CONSTRAINT `questionmatchingtype_ibfk_9` FOREIGN KEY (`questionID`) REFERENCES `question` (`questionID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionmatchingtype`
--

LOCK TABLES `questionmatchingtype` WRITE;
/*!40000 ALTER TABLE `questionmatchingtype` DISABLE KEYS */;
INSERT INTO `questionmatchingtype` VALUES (1,3,75,75,72,72,73,73,74,74);
/*!40000 ALTER TABLE `questionmatchingtype` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questiontype`
--

LOCK TABLES `questiontype` WRITE;
/*!40000 ALTER TABLE `questiontype` DISABLE KEYS */;
INSERT INTO `questiontype` VALUES (4,'Matching Type(English Choices)'),(3,'Matching Type(Native Choices)'),(1,'Multiple Choice (English Choices)'),(2,'Multiple Choice (Native Choices)');
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
  `isActive` bit(1) NOT NULL DEFAULT b'1',
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
INSERT INTO `section` VALUES (27,12,'test12',_binary '\0','test section example',1,_binary ''),(28,23,'for hiligaynon test',_binary '\0','test',2,_binary '');
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
  `isActive` bit(1) NOT NULL DEFAULT b'1',
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
INSERT INTO `unit` VALUES (1,1,'test12','testsdf',27,0,_binary ''),(2,2,'Unit 2','test 2',27,0,_binary ''),(3,3,'Unit 3','Test 3',27,0,_binary ''),(4,4,'Unit 4','testsdf',27,0,_binary ''),(5,5,'sdaf','dslajsf',27,0,_binary ''),(6,6,'dja','sadjklf',27,0,_binary ''),(7,7,'djkf','dfjl',27,0,_binary ''),(8,8,'sdkajf','adkjkf',27,0,_binary ''),(9,10,'dfag','sdflj',27,0,_binary ''),(10,9,'dfsg','esef',27,0,_binary ''),(11,11,'sdjioaf','sdafkj',27,0,_binary ''),(12,12,'dsakjf','sadflkjkj',27,0,_binary ''),(13,13,'sldkjaf','sdlfkj',27,0,_binary ''),(14,14,'SDJF','DFJL',27,0,_binary ''),(15,15,'ESWANN','123',27,0,_binary ''),(16,16,'JR','SDJLF',27,0,_binary ''),(17,1,'tes','sdf',28,0,_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Admin','vistalk10101@gmail.com',NULL,'d6654413f18171dea31642b93dc58f84',_binary '',_binary '',_binary '\0',_binary '\0',NULL,NULL),(5,'Test1','joshuaharvillecaranzo@gmail.com',NULL,'Joshua',_binary '',_binary '\0',_binary '',_binary '\0',NULL,NULL),(10,'Test1','joshuaharvillecaranzo1@gmail.com',NULL,'Joshua',_binary '',_binary '\0',_binary '',_binary '\0',NULL,NULL),(11,'Joshua Caranzo','joshuaharvillecaranzo2@gmail.com',NULL,'Joshua',_binary '',_binary '\0',_binary '',_binary '\0',NULL,NULL),(12,'Joshua Caranzo','joshuaharville21603@gmail.com',NULL,'Jishua',_binary '',_binary '\0',_binary '',_binary '\0',NULL,NULL),(13,'Aldrich','aldrichbatislaon@gmail.com',NULL,'Aldrichdrixh',_binary '',_binary '\0',_binary '',_binary '\0',NULL,NULL);
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
  CONSTRAINT `userfeedback_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
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
  `Id` int NOT NULL AUTO_INCREMENT,
  `userPlayerId` int NOT NULL,
  `itemId` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `userPlayerId` (`userPlayerId`),
  KEY `itemId` (`itemId`),
  CONSTRAINT `useritem_ibfk_1` FOREIGN KEY (`userPlayerId`) REFERENCES `vista` (`userPlayerId`),
  CONSTRAINT `useritem_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `item` (`itemID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useritem`
--

LOCK TABLES `useritem` WRITE;
/*!40000 ALTER TABLE `useritem` DISABLE KEYS */;
INSERT INTO `useritem` VALUES (1,5,1,0),(2,10,1,0),(3,11,1,0),(4,12,1,0),(5,13,1,0);
/*!40000 ALTER TABLE `useritem` ENABLE KEYS */;
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
  CONSTRAINT `userunit_ibfk_1` FOREIGN KEY (`userPlayerID`) REFERENCES `vista` (`userPlayerId`),
  CONSTRAINT `userunit_ibfk_2` FOREIGN KEY (`unitID`) REFERENCES `unit` (`unitID`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userunit`
--

LOCK TABLES `userunit` WRITE;
/*!40000 ALTER TABLE `userunit` DISABLE KEYS */;
INSERT INTO `userunit` VALUES (1,5,1,0,0,0),(2,5,2,0,0,0),(3,5,3,0,0,0),(4,5,4,0,0,0),(5,5,5,0,0,0),(6,5,6,0,0,0),(7,5,7,0,0,0),(8,5,8,0,0,0),(9,5,9,0,0,0),(10,5,10,0,0,0),(11,5,11,0,0,0),(12,5,12,0,0,0),(13,5,13,0,0,0),(14,5,14,0,0,0),(15,5,15,0,0,0),(16,5,16,0,0,0),(17,10,1,0,0,0),(18,10,2,0,0,0),(19,10,3,0,0,0),(20,10,4,0,0,0),(21,10,5,0,0,0),(22,10,6,0,0,0),(23,10,7,0,0,0),(24,10,8,0,0,0),(25,10,9,0,0,0),(26,10,10,0,0,0),(27,10,11,0,0,0),(28,10,12,0,0,0),(29,10,13,0,0,0),(30,10,14,0,0,0),(31,10,15,0,0,0),(32,10,16,0,0,0),(33,11,1,0,0,0),(34,11,2,0,0,0),(35,11,3,0,0,0),(36,11,4,0,0,0),(37,11,5,0,0,0),(38,11,6,0,0,0),(39,11,7,0,0,0),(40,11,8,0,0,0),(41,11,9,0,0,0),(42,11,10,0,0,0),(43,11,11,0,0,0),(44,11,12,0,0,0),(45,11,13,0,0,0),(46,11,14,0,0,0),(47,11,15,0,0,0),(48,11,16,0,0,0),(49,12,1,0,0,0),(50,12,2,0,0,0),(51,12,3,0,0,0),(52,12,4,0,0,0),(53,12,5,0,0,0),(54,12,6,0,0,0),(55,12,7,0,0,0),(56,12,8,0,0,0),(57,12,9,0,0,0),(58,12,10,0,0,0),(59,12,11,0,0,0),(60,12,12,0,0,0),(61,12,13,0,0,0),(62,12,14,0,0,0),(63,12,15,0,0,0),(64,12,16,0,0,0),(65,13,1,0,0,0),(66,13,2,0,0,0),(67,13,3,0,0,0),(68,13,4,0,0,0),(69,13,5,0,0,0),(70,13,6,0,0,0),(71,13,7,0,0,0),(72,13,8,0,0,0),(73,13,9,0,0,0),(74,13,10,0,0,0),(75,13,11,0,0,0),(76,13,12,0,0,0),(77,13,13,0,0,0),(78,13,14,0,0,0),(79,13,15,0,0,0),(80,13,16,0,0,0);
/*!40000 ALTER TABLE `userunit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vista`
--

DROP TABLE IF EXISTS `vista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vista` (
  `userPlayerId` int NOT NULL,
  `vCoin` int NOT NULL DEFAULT '0',
  `totalScoreWeekly` int NOT NULL DEFAULT '0',
  `isPremium` bit(1) NOT NULL DEFAULT b'0',
  `premiumExpiry` datetime DEFAULT NULL,
  `currentLanguageId` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`userPlayerId`),
  KEY `currentLanguageId` (`currentLanguageId`),
  CONSTRAINT `vista_ibfk_1` FOREIGN KEY (`currentLanguageId`) REFERENCES `language` (`languageID`),
  CONSTRAINT `vista_ibfk_2` FOREIGN KEY (`userPlayerId`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vista`
--

LOCK TABLES `vista` WRITE;
/*!40000 ALTER TABLE `vista` DISABLE KEYS */;
INSERT INTO `vista` VALUES (5,0,0,_binary '\0',NULL,1),(10,0,0,_binary '\0',NULL,1),(11,0,0,_binary '\0',NULL,1),(12,0,0,_binary '\0',NULL,1),(13,0,0,_binary '\0',NULL,1);
/*!40000 ALTER TABLE `vista` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-02  0:09:25
