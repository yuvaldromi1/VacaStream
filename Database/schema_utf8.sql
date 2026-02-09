-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: vacastream
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `vacastream`
--

/*!40000 DROP DATABASE IF EXISTS `vacastream`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `vacastream` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vacastream`;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `userId` int NOT NULL,
  `vacationId` int NOT NULL,
  PRIMARY KEY (`userId`,`vacationId`),
  KEY `vacationId` (`vacationId`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (2,1),(3,1),(4,1),(3,2),(2,3),(3,3),(4,3),(4,4),(2,5),(3,5),(4,5),(2,7),(3,7),(4,7),(3,8),(2,9),(3,9),(4,9),(4,10),(2,11),(4,11),(3,12),(4,12);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Yuval','Dromi','yuval@test.com','$2a$10$u9D8YoWd75pl95mUVvr6wuxsFYjEfmo17e654br5KJUZhQ2TeTRz2','admin'),(2,'Shira','Dromi','shira@test.com','$2a$10$kE6ZP3Iulhh2wQ1oUDrLZOEI..BeUh18KpvJlIueMO3UlbzQ3WxjS','user'),(3,'Rona','Dromi','rona@test.com','$2a$10$7iDs7biwf8Hwdbi0KBWR5uX1MGgzuI1onxKCRdtkeuSVJw8dH.qzW','user'),(4,'Zohar','Dromi','zohar@test.com','$2a$10$H6PMasrTA5cMQu5lDEeHT.TALbLkRDpkTxzXrPrKORmpRdfwqe/lq','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `imageFileName` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Paris, France','The City of Lights awaits with the Eiffel Tower, Louvre Museum, charming cafes, and world-class cuisine along the Seine.','2026-06-01','2026-06-08',2500.00,'6adcb10b-c7ed-4c6e-8d98-4cef229c7b96.jpg'),(2,'Tokyo, Japan','Ancient temples meet cutting-edge technology. Explore Shibuya, taste authentic ramen, and visit serene gardens.','2026-04-01','2026-04-10',4200.00,'226238a9-9432-4770-9103-85ea32f63913.jpg'),(3,'Santorini, Greece','Whitewashed villages perched on volcanic cliffs, breathtaking sunsets over the Aegean Sea, and unforgettable Mediterranean cuisine.','2026-02-10','2026-04-10',5200.00,'0b325310-0289-406e-a67a-f4ba35b53ea8.jpg'),(4,'New York, USA','The city that never sleeps! Broadway shows, Central Park, Times Square, and the best pizza you will ever taste.','2026-05-01','2026-05-07',3800.00,'84d75ca8-adb3-402c-934d-d0aad2eda16c.jpg'),(5,'Bali, Indonesia','Tropical paradise with lush rice terraces, ancient temples, and crystal-clear waters for surfing and diving.','2026-06-10','2026-06-20',2800.00,'2e459663-e3ba-45b3-a841-27302cd7ad83.jpg'),(6,'Barcelona, Spain','Gaudi masterpieces, Mediterranean beaches, and tapas bars. Experience the vibrant culture of Catalonia.','2026-02-15','2026-02-25',2200.00,'ccf80ebe-931f-4953-b36c-3d1d4b24194a.jpg'),(7,'Maldives','Ultimate luxury with overwater bungalows, pristine beaches, and incredible underwater coral reefs.','2026-07-01','2026-07-08',6500.00,'10d7fdba-bfe0-414e-9c48-b0796fcc3b92.jpg'),(8,'Rome, Italy','Walk through ancient history at the Colosseum, toss a coin in the Trevi Fountain, and enjoy authentic pasta.','2026-04-15','2026-04-22',2700.00,'ac6b4fac-8188-456e-80db-abc57cd94fdc.jpg'),(9,'Dubai, UAE','Futuristic skyline, luxury shopping, desert safaris, and the iconic Burj Khalifa. A city of superlatives.','2026-08-01','2026-08-07',3500.00,'cea2af75-f3c7-4466-aa62-39b5454edefe.jpg'),(10,'Machu Picchu, Peru','Trek to the ancient Incan citadel high in the Andes. A once-in-a-lifetime adventure through mountain scenery.','2026-09-10','2026-09-18',4000.00,'5fb73608-002e-4a72-ac21-e32470efa2a6.jpg'),(11,'Swiss Alps, Switzerland','Ski pristine slopes, hike alpine meadows, and enjoy cozy mountain villages with fondue and chocolate.','2026-03-01','2026-03-08',4500.00,'21afdf1f-8f07-45e9-91d0-5a3e6e93edec.jpg'),(12,'Cape Town, South Africa','Table Mountain, stunning coastlines, world-class wineries, and safari adventures just hours away.','2026-10-05','2026-10-14',3200.00,'0561e555-70b0-441b-916a-f8bc23ba5236.jpg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-09 17:32:30
