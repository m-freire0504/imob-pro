import express from "express";
import { autenticarCorretor, alterarSenhaCorretor } from "./auth-corretor";

const router = express.Router();

/**
 * POST /api/corretor/login
 * Autentica um corretor com email e senha
 */
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        motivo: "Email e senha são obrigatórios",
      });
    }

    const resultado = await autenticarCorretor(email, senha);

    if (resultado.sucesso) {
      // Aqui você pode criar uma sessão ou JWT se desejar
      // Por enquanto, retornamos apenas os dados do corretor
      return res.json({
        sucesso: true,
        corretor: resultado.corretor,
        senhaTemporaria: resultado.senhaTemporaria,
      });
    } else {
      return res.status(401).json({
        sucesso: false,
        motivo: resultado.motivo,
      });
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({
      sucesso: false,
      motivo: "Erro ao fazer login",
    });
  }
});

/**
 * POST /api/corretor/alterar-senha
 * Altera a senha de um corretor
 */
router.post("/alterar-senha", async (req, res) => {
  try {
    const { corretorId, senhaAtual, novaSenha } = req.body;

    if (!corretorId || !senhaAtual || !novaSenha) {
      return res.status(400).json({
        sucesso: false,
        motivo: "Todos os campos são obrigatórios",
      });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({
        sucesso: false,
        motivo: "A nova senha deve ter pelo menos 8 caracteres",
      });
    }

    const resultado = await alterarSenhaCorretor(corretorId, senhaAtual, novaSenha);

    if (resultado.sucesso) {
      return res.json({
        sucesso: true,
        mensagem: "Senha alterada com sucesso",
      });
    } else {
      return res.status(400).json({
        sucesso: false,
        motivo: resultado.motivo,
      });
    }
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return res.status(500).json({
      sucesso: false,
      motivo: "Erro ao alterar senha",
    });
  }
});

export default router;
