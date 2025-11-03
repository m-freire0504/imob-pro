CREATE TABLE `loginAudit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`corretorId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`sucesso` boolean NOT NULL,
	`motivo` varchar(255),
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loginAudit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `corretores` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `corretores` MODIFY COLUMN `ativo` boolean NOT NULL DEFAULT true;--> statement-breakpoint
ALTER TABLE `inquilinos` MODIFY COLUMN `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `corretores` ADD `senhaHash` varchar(255);--> statement-breakpoint
ALTER TABLE `corretores` ADD `senhaTemporaria` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `corretores` ADD `ultimoAcesso` timestamp;--> statement-breakpoint
ALTER TABLE `corretores` ADD CONSTRAINT `corretores_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `loginAudit` ADD CONSTRAINT `loginAudit_corretorId_corretores_id_fk` FOREIGN KEY (`corretorId`) REFERENCES `corretores`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquilinos` DROP COLUMN `endereco`;--> statement-breakpoint
ALTER TABLE `inquilinos` DROP COLUMN `observacoes`;