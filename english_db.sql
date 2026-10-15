-- Database: `amirsiteDb`
-- Set standard UTF8mb4 for full compatibility
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--
-- Note: In a real app, passwords should be hashed (e.g., bcrypt), not plain text like '123'
INSERT INTO `admin` (`username`, `password`) VALUES
('admin', '123');

-- --------------------------------------------------------

--
-- Table structure for table `t1`
--

DROP TABLE IF EXISTS `t1`;
CREATE TABLE IF NOT EXISTS `t1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `case_` varchar(255) NOT NULL,
  `strap` varchar(255) NOT NULL,
  `glasp` varchar(255) NOT NULL, -- Note: "glasp" seems to be a typo for "clasp" in your original code
  `picUrl` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `t1` (English Translations)
--

INSERT INTO `t1` (`name`, `case_`, `strap`, `glasp`, `picUrl`, `gender`) VALUES
('Classic Steel Model 1', '43mm Stainless Steel - 12mm Thickness - 50m Water Resistance', 'Genuine Leather - Titanium Links', 'Deployant Buckle', 'pictures/products/m1.jpg', 'man'),
('Classic Steel Model 2', '43mm Stainless Steel - 12mm Thickness - 50m Water Resistance', 'Genuine Leather - Titanium Links', 'Deployant Buckle', 'pictures/products/m2.jpg', 'man'),
('Elegant Lady V1', '38mm Stainless Steel - 10mm Thickness - 30m Water Resistance', 'Slim Leather Strap', 'Pin Buckle', 'pictures/products/w1.jpg', 'woman'),
('Elegant Lady V2', '38mm Stainless Steel - 10mm Thickness - 30m Water Resistance', 'Slim Leather Strap', 'Pin Buckle', 'pictures/products/w2.jpg', 'woman'),
('Sport Chrono', 'Carbon Fiber Case - Shock Resistant', 'Rubber Sport Strap', 'Velcro Fastening', 'pictures/products/m4.jpg', 'man'),
('Diver Pro', '45mm Titanium - 300m Water Resistance', 'Stainless Steel Mesh', 'Safety Clasp', 'pictures/products/m1.jpg', 'man'),
('Luxury Gold', '18k Gold Plated - Sapphire Crystal', 'Alligator Leather', 'Butterfly Clasp', 'pictures/products/w1.jpg', 'woman'),
('Ceramic White', 'White Ceramic Case - Scratch Proof', 'Ceramic Bracelet', 'Hidden Clasp', 'pictures/products/w2.jpg', 'woman');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;