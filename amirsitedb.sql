-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 06, 2024 at 04:13 PM
-- Server version: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amirtava_amirsiteDb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `username` varchar(20) COLLATE utf8_estonian_ci NOT NULL,
  `password` varchar(20) COLLATE utf8_estonian_ci NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_estonian_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`username`, `password`) VALUES
('admin', '123');

-- --------------------------------------------------------

--
-- Table structure for table `t1`
--

DROP TABLE IF EXISTS `t1`;
CREATE TABLE IF NOT EXISTS `t1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_persian_ci NOT NULL,
  `case_` varchar(255) COLLATE utf8_persian_ci NOT NULL,
  `strap` varchar(255) COLLATE utf8_persian_ci NOT NULL,
  `glasp` varchar(255) COLLATE utf8_persian_ci NOT NULL,
  `picUrl` varchar(255) COLLATE utf8_persian_ci NOT NULL,
  `gender` varchar(10) COLLATE utf8_persian_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

--
-- Dumping data for table `t1`
--

INSERT INTO `t1` (`id`, `name`, `case_`, `strap`, `glasp`, `picUrl`, `gender`) VALUES
(1, 'محصول1 جدید', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m1.jpg', 'man'),
(2, 'محصول2', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m2.jpg', 'man'),
(3, 'محصول3', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w1.jpg', 'woman'),
(4, 'محصول4', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w2.jpg', 'woman'),
(17, 'محصول خوب', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man'),
(18, 'محصول خوب', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man'),
(20, 'محصول5', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m1.jpg', 'man'),
(21, 'محصول6', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m2.jpg', 'man'),
(22, 'محصول7', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w1.jpg', 'woman'),
(23, 'محصول8', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w2.jpg', 'woman'),
(24, 'محصول خوب', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man'),
(25, 'محصول خوب9', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man'),
(26, 'محصول10', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m1.jpg', 'man'),
(27, 'محصول11', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m2.jpg', 'man'),
(28, 'محصول12', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w1.jpg', 'woman'),
(29, 'محصول13', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w2.jpg', 'woman'),
(30, 'محصول خوب14', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man'),
(31, 'محصول خوب15', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man'),
(32, 'محصول16', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m1.jpg', 'man'),
(33, 'محصول17', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/m2.jpg', 'man'),
(34, 'محصول18', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w1.jpg', 'woman'),
(35, 'محصول19', '43 میلی متر فولاد ضد زنگ-12 میلی متر ضخامت-مقاوت در برابر آی تا 50 متر', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'چرم اصل یکپارچه-دسته فلزی تیتانیومی', 'pictures/products/w2.jpg', 'woman'),
(36, 'محصول خوب', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man'),
(37, 'محصول خوب20', 'کیسش هم خیلی خوبه', 'استرپش هم عالیه', 'کلسپش هم بد نیست', 'pictures/products/m4.jpg', 'man');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
