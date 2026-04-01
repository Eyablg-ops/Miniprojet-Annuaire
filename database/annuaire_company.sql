-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mer. 01 avr. 2026 à 13:24
-- Version du serveur : 8.0.44
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `internship_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `annuaire_company`
--

CREATE TABLE `annuaire_company` (
  `id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `description` text,
  `services` text,
  `website` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','PENDING') DEFAULT 'ACTIVE',
  `source` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `annuaire_company`
--

INSERT INTO `annuaire_company` (`id`, `name`, `city`, `country`, `description`, `services`, `website`, `status`, `source`, `created_at`, `updated_at`) VALUES
(1, 'Mobirevo - Web, Mobile App & Software Development Company', 'Tunis', 'Tunisie', 'Mobirevo is a Leading custom software development agency focused on web, mobile app development & saas application development.', 'Custom Software Development, Mobile App Development, Web Design', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(2, 'ZetaBox', 'Sfax', 'Tunisie', 'ZetaBox delivers custom software development, transforming ideas into powerful, scalable solutions with cutting-edge technology and client focus.', 'Web Development, Mobile App Development, UX/UI Design', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(3, 'Key Software', 'Tunis', 'Tunisie', 'We provide tailored web, mobile & enterprise software globally, serving public & private clients in Europe and Tunisia.', 'Web Development, Artificial Intelligence, IT Consulting', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(4, 'Xilyor LLC', 'Sfax', 'Tunisie', 'Xilyor delivers cutting-edge web development, AI-powered applications, and custom software solutions that drive business success.', 'Web Development, Mobile App Development, Desktop App Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(5, 'Interacti Marketing Agency', 'Sfax', 'Tunisie', 'Digital Marketing Agency\nInteracti Marketing Agency is a marketing agency based in Sfax, Tunisia.', 'Advertising, Branding, Direct Marketing', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(6, 'K.Manager', 'Kairouan', 'Tunisie', 'Solutions innovantes de développement web et mobile pour les entreprises, avec SEO et ERP sur mesure pour une transformation digitale efficace.', 'Mobile App Development, Web Development, ERP Consulting', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(7, 'TRVL CODE', 'Sousse', 'Tunisie', 'A pioneer in travel technology with a variety of services offering cutting-edge IT solutions for the international travel industry.', 'Custom Software Development, Mobile App Development, UX/UI Design', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(8, 'NOVATIS', 'Tunis', 'Tunisie', 'Custom web development and SEO agency in Paris delivering creative, high-performance digital solutions since 2009.', 'SEO, Web Development, E-Commerce Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(9, 'TSB COMMERCIAL', 'Sfax', 'Tunisie', 'TSB COMMERCIAL Your Ultimate Growth Partner in Tunisia 🚀 Boost Your Sales, Maximize Your Reach, and Dominate the Market!', 'Digital Strategy, Event Marketing & Planning, Advertising', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(10, 'Digital Rise Solutions', 'Kairouan', 'Tunisie', 'Digital Rise Solutions: Premier SEO agency in Tunisia offering expert consultancy. Enhance online presence, increase traffic, and achieve top rankings', 'SEO, Advertising, Marketing Strategy', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(11, 'Boostify Digital Agency', 'Ariana', 'Tunisie', 'Boostify Digital Agency is a Google Partner Premier digital marketing agency based in Tunisia. We specialize in SEO and Google Ads (SEA).', 'SEO, Pay Per Click, Web Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(12, 'CYBERMECH SYSTEMS', 'Tunis', 'Tunisie', 'Tailored Solutions for Mechatronic Systems, AI & Automation, from embedded systems and ERP platforms to machine learning–driven applications.​', 'ERP Consulting, Custom Software Development, Web Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(13, 'Devlopy', 'Tunis', 'Tunisie', 'PROVIDING THE SIMPLEST SOLUTIONS FOR YOUR MOST COMPLEX PROBLEMS', 'E-Commerce Development, Custom Software Development, Mobile App Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(14, 'Jasmin Marketing and Advertising Agency', 'Tunis', 'Tunisie', 'Jasmin Marketing is a full-service communications agency that specializes in developing strategic and creative solutions for our clients.', 'Branding, Market Research, Marketing Strategy', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(15, 'SOFTTODO', 'Sfax', 'Tunisie', 'Expert in offshore web and mobile development, specializing in TYPO3, WordPress, and enterprise software solutions.', 'Custom Software Development, Web Development, Mobile App Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(16, 'Rodoud.com', 'Tunis', 'Tunisie', 'Rodoud.com: Your 24/7 AI-powered chatbot for seamless customer interactions, smart automation, and personalized support across all channels.', 'Artificial Intelligence, Web Development, Mobile App Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(17, 'Tchesy', 'Manouba', 'Tunisie', 'Web solutions and mobile applications development company.\n\nWe are releasing web projects and mobile applications with the latest development technolo...', 'Web Development, E-Commerce Development, Digital Strategy', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(18, 'INSIGHT', 'Tunis', 'Tunisie', 'INSIGHT is an international consulting firm specialised in UX design and UX research based in Tunis, Tunisia.', 'UX/UI Design, Custom Software Development, Web Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(19, 'Avempace Technologies', 'Tunis', 'Tunisie', 'Avempace is a design center for embedded systems and IoT solutions with a proven expertise of real time audio/video communication, wireless and RFID', 'IoT Development, IT Consulting', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(20, 'Silkdev - Global Website Design Company', 'Bizerte', 'Tunisie', 'Building Digital Empires: SilkDev specializes in rapid, high-conversion web design and development for industry leaders.', 'Web Development, E-Commerce Development, Branding', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(21, 'UP Creative, Inc.', 'Tunis', 'Tunisie', 'UP Creative, Inc. is the premier provider of global outsource technology solutions. With 200 employees globally, we offer in-house teams for programmi...', 'Custom Software Development, Voice, Non-Voice BPO', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(22, 'Creativa', 'Tunis', 'Tunisie', 'We are a community of experts, professionals and freelancers.\nWe provide access to talents for digital agencies, small businesses and startups.', 'Video Production, SMM, Graphic Design', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(23, 'Appinov', 'Tunis', 'Tunisie', 'Entreprise des services numérique en Tunisie et en France', 'Custom Software Development, Mobile App Development, Web Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(24, 'SAC Marquage', 'Sfax', 'Tunisie', 'An RFID solutions company provides hardware and software for tracking and managing assets using radio waves', 'Custom Software Development, Web Development, IoT Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(25, 'Astra Digital Solutions', 'Tunis', 'Tunisie', 'Astra Digital Solutions builds custom websites, designs, and SEO strategies to help brands grow and stand out in the digital space.', 'Web Development, Graphic Design, No-Code Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(26, 'Coding Dojo Africa', 'Ariana', 'Tunisie', 'Interested in starting your new career in tech? Learn to code at one of the top coding bootcamps Build your first website and app in a matter of weeks', 'Web Development, Artificial Intelligence, Cybersecurity', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(27, 'eDonec', 'Tunis', 'Tunisie', 'eDonec was founded by two engineers back in 2017. We grew technically, financially and as a human structure at a relatively slow but solid pace tackli...', 'Mobile App Development, Web Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(28, 'SUNEVIT', 'Sfax', 'Tunisie', 'We help companies digitize their operations through innovative software solutions', 'Web Development, Mobile App Development, Custom Software Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(29, 'UTEEK Digital', 'Tunis', 'Tunisie', 'Make Your Brand Stand Out!', 'Web Development, Web Design, E-Commerce Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(30, 'OneTech Business Solutions', 'Ariana', 'Tunisie', 'We are The Trusted System Integrator in Tunisia with geographical coverage in Algeria, Libya and France', 'IT Managed, IT Staff Augmentation, Unified Communications Consulting', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(31, 'CAMEL SOFT LLC', 'Sousse', 'Tunisie', 'CAMEL SOFT LLC is a leading provider of IT solutions and services company.', 'Enterprise App Modernization, Application Management & Support, Application Testing', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44'),
(32, 'DuetoData', 'Sousse', 'Tunisie', 'DuetoData is your digital Solution provider, We unlock new businesses through Digital Solutions based on Data.', 'Artificial Intelligence, Web Development, Mobile App Development', NULL, 'ACTIVE', 'techbehemoths', '2026-03-31 23:07:44', '2026-03-31 23:07:44');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annuaire_company`
--
ALTER TABLE `annuaire_company`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annuaire_company`
--
ALTER TABLE `annuaire_company`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
