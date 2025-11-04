# Sistema de Gestão Imobiliária - TODO

## Módulo 1: CRM (Gestão de Relacionamento com o Cliente)
- [ ] Cadastro de Proprietários (dados pessoais, contato, lista de imóveis)
- [ ] Cadastro de Inquilinos (dados pessoais, contato, histórico de locações)
- [ ] Cadastro de Clientes/Leads (dados de contato, origem do lead, perfil de interesse)
- [ ] Registro de Demandas (especificações do imóvel desejado pelo cliente)
- [ ] Sistema de "match" (sugerir imóveis compatíveis com demandas)

## Módulo 2: Gestão de Imóveis (Estoque)
- [ ] Cadastro completo de imóveis (código, título, tipo, status)
- [ ] Localização (endereço completo, busca por CEP, mapa integrado)
- [ ] Características (área útil/total, quartos, suítes, banheiros, vagas, andar)
- [ ] Valores (preço de venda, locação, condomínio, IPTU)
- [ ] Descrição detalhada do imóvel
- [ ] Dados de concessionárias (matrícula IPTU, relógios de luz, água e gás)
- [ ] Galeria de mídia (upload múltiplo de fotos, drag-and-drop)
- [ ] Vídeos e tours virtuais 360° (links YouTube/Vimeo)
- [ ] Reordenar fotos e definir imagem de capa
- [ ] Busca e filtragem avançada (tipo, preço, quartos, localização, status)
- [ ] Ordenação de resultados (preço, data de cadastro)

## Módulo 3: Gestão de Corretores e Equipes
- [ ] Cadastro de corretores (dados pessoais, CPF, CRECI, contato)
- [ ] Dados de acesso (login e senha)
- [ ] Vínculo a equipe ou gerente
- [ ] Agenda do corretor (calendário para visitas e reuniões)
- [ ] Registro de ligações realizadas
- [ ] Histórico de interações com contatos
- [ ] Definição de metas (vendas, captação, locação)
- [ ] Relatórios de desempenho individual (imóveis mostrados, captados, vendas/locações)
- [ ] Taxa de conversão de leads

## Módulo 4: Controle de Comissões
- [ ] Configuração de regras de comissão (percentuais para venda e locação)
- [ ] Regras de divisão de comissão (captador vs vendedor)
- [ ] Cálculo automático de comissões
- [ ] Lançamento de vendas/locações com data
- [ ] Extrato de comissões a pagar por corretor
- [ ] Histórico de comissões pagas

## Módulo 5: Dashboard e Relatórios Gerenciais
- [ ] Dashboard principal com gráficos
- [ ] Número de imóveis por status
- [ ] Ranking de corretores
- [ ] Total de vendas e locações no mês/ano
- [ ] Relatório de estoque de imóveis
- [ ] Relatório de vendas por período
- [ ] Relatório de desempenho de corretores e equipes

## Formulários e Validação
- [x] Formulário de cadastro de imóveis com validação
- [ ] Formulário de cadastro de proprietários
- [ ] Formulário de cadastro de inquilinos
- [x] Formulário de cadastro de leads
- [x] Formulário de cadastro de corretores
- [ ] Validação de CPF/CNPJ
- [ ] Validação de CEP com busca de endereço

## Upload de Fotos e Galeria
- [ ] Upload de fotos com drag-and-drop
- [ ] Integração com S3 para armazenamento
- [ ] Galeria de imóveis com visualização
- [ ] Reordenação de fotos
- [ ] Definir foto de capa
- [ ] Compressão de imagens

## Busca e Filtros Avançados
- [ ] Busca por texto em imóveis
- [ ] Filtros por tipo, preço, localização
- [ ] Filtros por status
- [ ] Ordenação de resultados
- [ ] Busca em leads
- [ ] Busca em proprietários

## Integração Google Maps
- [ ] Mapa interativo para localização de imóveis
- [ ] Geocodificação de endereços
- [ ] Visualização de múltiplos imóveis no mapa
- [ ] Cálculo de distâncias

## Sistema de Notificações
- [ ] Notificações de novas vendas
- [ ] Notificações de novos leads
- [ ] Notificações de atividades vencidas
- [ ] Centro de notificações
- [ ] Histórico de notificações

## Relatórios em PDF
- [ ] Relatório de estoque de imóveis
- [ ] Relatório de vendas por período
- [ ] Relatório de desempenho de corretores
- [ ] Relatório de comissões
- [ ] Ficha do imóvel em PDF

## Exportação de Dados
- [ ] Exportar imóveis para Excel
- [ ] Exportar leads para Excel
- [ ] Exportar comissões para Excel
- [ ] Exportar relatório de vendas

## Melhorias de UX
- [ ] Modais para confirmação de ações
- [ ] Toast notifications para feedbacks
- [ ] Loading states em operações
- [ ] Paginação em listas
- [ ] Skeleton loaders
- [ ] Mensagens de erro amigáveis
- [ ] Confirmação de exclusão

## Autenticação de Corretores
- [x] Schema com campos de senha e senha temporária
- [x] Utilitários de criptografia (bcrypt)
- [x] Página de login para corretores
- [x] Página de alteração obrigatória de senha
- [x] Rotas de autenticação no servidor
- [x] Auditoria de login
- [ ] Integração com sistema de email para envio de credenciais
- [ ] Recuperação de senha

## Controle de Acesso por Perfil
- [x] Middleware de autorização nos procedures tRPC
- [ ] Dashboard personalizado por perfil (Admin/Gerente/Corretor/Proprietário)
- [ ] Filtros automáticos baseados no usuário logado
- [ ] Restrição de acesso a dados sensíveis

## Formulários de Cadastro
- [x] Formulário de cadastro de leads com redes sociais
- [x] Formulário de cadastro de corretores com redes sociais
- [x] Formulário de cadastro de imóveis
- [ ] Formulário de cadastro de proprietários
- [ ] Formulário de cadastro de inquilinos

## Compartilhamento em Redes Sociais
- [x] Componente de compartilhamento de imóveis
- [x] Integração com WhatsApp
- [x] Integração com Instagram
- [x] Integração com X (Twitter)
- [x] Geração de mensagens personalizadas
- [x] Cópia de mensagens para clipboard

## Infraestrutura e Design
- [x] Estrutura do banco de dados
- [x] Sistema de autenticação com níveis de permissão
- [x] Interface responsiva (desktop, tablet, mobile)
- [x] Integração com armazenamento S3 para fotos
- [ ] Documentação do usuário
