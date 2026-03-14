CREATE TABLE `flashcards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`area` varchar(255) NOT NULL,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flashcards_id` PRIMARY KEY(`id`)
);
