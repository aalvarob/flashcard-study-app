CREATE TABLE `flashcardProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`flashcardId` varchar(255) NOT NULL,
	`area` varchar(255) NOT NULL,
	`enabled` int NOT NULL DEFAULT 0,
	`correctCount` int NOT NULL DEFAULT 0,
	`wrongCount` int NOT NULL DEFAULT 0,
	`notSureCount` int NOT NULL DEFAULT 0,
	`notRememberCount` int NOT NULL DEFAULT 0,
	`lastAnsweredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flashcardProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studySessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`candidateName` varchar(255) NOT NULL,
	`area` varchar(255) NOT NULL,
	`cardsPerArea` int NOT NULL,
	`totalCards` int NOT NULL,
	`correctCount` int NOT NULL DEFAULT 0,
	`wrongCount` int NOT NULL DEFAULT 0,
	`notSureCount` int NOT NULL DEFAULT 0,
	`notRememberCount` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studySessions_id` PRIMARY KEY(`id`)
);
