CREATE TABLE `atividades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`corretorId` int NOT NULL,
	`tipo` enum('ligacao','visita','reuniao','outro') NOT NULL,
	`leadId` int,
	`imovelId` int,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`dataHora` timestamp NOT NULL,
	`duracao` int,
	`resultado` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `atividades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comissoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transacaoId` int NOT NULL,
	`corretorId` int NOT NULL,
	`tipo` enum('captacao','venda') NOT NULL,
	`percentual` int NOT NULL,
	`valor` int NOT NULL,
	`status` enum('pendente','pago') NOT NULL DEFAULT 'pendente',
	`dataPagamento` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comissoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `configComissoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('venda','locacao') NOT NULL,
	`percentualCaptacao` int NOT NULL,
	`percentualVenda` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `configComissoes_id` PRIMARY KEY(`id`),
	CONSTRAINT `configComissoes_tipo_unique` UNIQUE(`tipo`)
);
--> statement-breakpoint
CREATE TABLE `corretores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`nome` varchar(255) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`creci` varchar(50) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(320),
	`equipe` varchar(100),
	`gerenteId` int,
	`metaVendas` int DEFAULT 0,
	`metaLocacoes` int DEFAULT 0,
	`metaCaptacoes` int DEFAULT 0,
	`ativo` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `corretores_id` PRIMARY KEY(`id`),
	CONSTRAINT `corretores_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `corretores_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `demandas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`tipoImovel` varchar(50),
	`finalidade` enum('venda','locacao') NOT NULL,
	`cidade` varchar(100),
	`bairro` varchar(100),
	`precoMin` int,
	`precoMax` int,
	`quartos` int,
	`suites` int,
	`vagas` int,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `demandas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fotosImoveis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imovelId` int NOT NULL,
	`url` varchar(500) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`ordem` int NOT NULL DEFAULT 0,
	`capa` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fotosImoveis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imoveis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`tipo` varchar(50) NOT NULL,
	`status` enum('disponivel','vendido','alugado','reservado') NOT NULL DEFAULT 'disponivel',
	`finalidade` enum('venda','locacao','ambos') NOT NULL,
	`proprietarioId` int NOT NULL,
	`corretorCaptadorId` int,
	`cep` varchar(10),
	`endereco` varchar(255),
	`numero` varchar(20),
	`complemento` varchar(100),
	`bairro` varchar(100),
	`cidade` varchar(100),
	`estado` varchar(2),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`areaUtil` int,
	`areaTotal` int,
	`quartos` int,
	`suites` int,
	`banheiros` int,
	`vagas` int,
	`andar` varchar(20),
	`precoVenda` int,
	`valorLocacao` int,
	`valorCondominio` int,
	`valorIptu` int,
	`matriculaIptu` varchar(100),
	`numeroReloglioLuz` varchar(100),
	`numeroRelogioAgua` varchar(100),
	`numeroMedidorGas` varchar(100),
	`descricao` text,
	`videoUrl` varchar(500),
	`tourVirtualUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `imoveis_id` PRIMARY KEY(`id`),
	CONSTRAINT `imoveis_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `inquilinos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(320),
	`endereco` text,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inquilinos_id` PRIMARY KEY(`id`),
	CONSTRAINT `inquilinos_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(320),
	`origem` varchar(100),
	`status` enum('novo','contatado','qualificado','negociacao','convertido','perdido') NOT NULL DEFAULT 'novo',
	`corretorId` int,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proprietarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpfCnpj` varchar(20) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(320),
	`endereco` text,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proprietarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `proprietarios_cpfCnpj_unique` UNIQUE(`cpfCnpj`)
);
--> statement-breakpoint
CREATE TABLE `transacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imovelId` int NOT NULL,
	`tipo` enum('venda','locacao') NOT NULL,
	`valor` int NOT NULL,
	`corretorCaptadorId` int,
	`corretorVendedorId` int NOT NULL,
	`clienteId` int,
	`dataTransacao` timestamp NOT NULL,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transacoes_id` PRIMARY KEY(`id`)
);
