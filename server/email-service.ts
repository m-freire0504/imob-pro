/**
 * Serviço de Email
 * Integra com o Forge API para envio de emails
 */

import { ENV } from "./_core/env";

interface EmailTemplate {
  para: string;
  assunto: string;
  html: string;
  texto?: string;
}

/**
 * Envia um email usando a API Forge
 */
export async function enviarEmail(template: EmailTemplate): Promise<boolean> {
  try {
    const response = await fetch(`${ENV.forgeApiUrl}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: template.para,
        subject: template.assunto,
        html: template.html,
        text: template.texto,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
}

/**
 * Envia credenciais de acesso para um corretor
 */
export async function enviarCredenciaisCorretor(
  email: string,
  nome: string,
  senhaTemporaria: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Bem-vindo ao Sistema de Gestão Imobiliária!</h1>
      
      <p>Olá <strong>${nome}</strong>,</p>
      
      <p>Você foi cadastrado como corretor no sistema. Aqui estão suas credenciais de acesso:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Senha Temporária:</strong> ${senhaTemporaria}</p>
      </div>
      
      <p style="color: #d32f2f; font-weight: bold;">
        ⚠️ Importante: Na primeira vez que fizer login, você será obrigado a alterar esta senha temporária.
      </p>
      
      <p>
        <a href="${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/login-corretor" 
           style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Fazer Login
        </a>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      
      <p style="color: #666; font-size: 12px;">
        Se você não solicitou este acesso ou tem dúvidas, entre em contato com o administrador.
      </p>
    </div>
  `;

  return enviarEmail({
    para: email,
    assunto: "Credenciais de Acesso - Sistema de Gestão Imobiliária",
    html,
    texto: `Bem-vindo ao Sistema de Gestão Imobiliária!\n\nEmail: ${email}\nSenha Temporária: ${senhaTemporaria}\n\nNa primeira vez que fizer login, você será obrigado a alterar esta senha.`,
  });
}

/**
 * Envia notificação de nova venda
 */
export async function enviarNotificacaoVenda(
  email: string,
  nomeCorretor: string,
  nomeImovel: string,
  preco: number
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4caf50;">🎉 Parabéns pela Venda!</h1>
      
      <p>Olá <strong>${nomeCorretor}</strong>,</p>
      
      <p>Você tem uma nova venda registrada no sistema:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Imóvel:</strong> ${nomeImovel}</p>
        <p><strong>Valor:</strong> R$ ${preco.toLocaleString("pt-BR")}</p>
      </div>
      
      <p>
        <a href="${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/dashboard" 
           style="background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Ver Detalhes
        </a>
      </p>
    </div>
  `;

  return enviarEmail({
    para: email,
    assunto: `Nova Venda: ${nomeImovel}`,
    html,
  });
}

/**
 * Envia notificação de novo lead
 */
export async function enviarNotificacaoLead(
  email: string,
  nomeCorretor: string,
  nomeLead: string,
  telefone: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2196f3;">📞 Novo Lead Atribuído</h1>
      
      <p>Olá <strong>${nomeCorretor}</strong>,</p>
      
      <p>Um novo lead foi atribuído a você:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Nome:</strong> ${nomeLead}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
      </div>
      
      <p>
        <a href="${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/leads" 
           style="background-color: #2196f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Ver Leads
        </a>
      </p>
    </div>
  `;

  return enviarEmail({
    para: email,
    assunto: `Novo Lead: ${nomeLead}`,
    html,
  });
}

/**
 * Envia confirmação de alteração de senha
 */
export async function enviarConfirmacaoAlteracaoSenha(
  email: string,
  nome: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">✅ Senha Alterada com Sucesso</h1>
      
      <p>Olá <strong>${nome}</strong>,</p>
      
      <p>Sua senha foi alterada com sucesso. Você agora pode fazer login com sua nova senha.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Se você não solicitou esta alteração, entre em contato com o administrador imediatamente.
      </p>
    </div>
  `;

  return enviarEmail({
    para: email,
    assunto: "Senha Alterada - Sistema de Gestão Imobiliária",
    html,
  });
}

/**
 * Envia link de recuperação de senha
 */
export async function enviarRecuperacaoSenha(
  email: string,
  nome: string,
  linkRecuperacao: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Recuperação de Senha</h1>
      
      <p>Olá <strong>${nome}</strong>,</p>
      
      <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
      
      <p style="margin: 30px 0;">
        <a href="${linkRecuperacao}" 
           style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Redefinir Senha
        </a>
      </p>
      
      <p style="color: #666; font-size: 12px;">
        Este link expira em 24 horas. Se você não solicitou esta recuperação, ignore este email.
      </p>
    </div>
  `;

  return enviarEmail({
    para: email,
    assunto: "Recuperação de Senha - Sistema de Gestão Imobiliária",
    html,
  });
}

/**
 * Envia relatório por email
 */
export async function enviarRelatorio(
  email: string,
  nome: string,
  titulo: string,
  conteudo: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">${titulo}</h1>
      
      <p>Olá <strong>${nome}</strong>,</p>
      
      <p>Segue em anexo o relatório solicitado.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        ${conteudo}
      </div>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Este é um email automático. Não responda a este endereço.
      </p>
    </div>
  `;

  return enviarEmail({
    para: email,
    assunto: titulo,
    html,
  });
}
