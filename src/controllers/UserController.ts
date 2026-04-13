import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.substring(10, 11));
}

export class UserController {

  static async register(req: Request, res: Response) {
    try {
      const { nome, email, senha, cpf } = req.body;

      if (!nome || !email || !senha || !cpf) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      const emailValido = /\S+@\S+\.\S+/.test(email);
      if (!emailValido) {
        return res.status(400).json({ message: "Email inválido" });
      }

      if (!validarCPF(cpf)) {
        return res.status(400).json({ message: "CPF inválido" });
      }

      const senhaForte = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(senha);
      if (!senhaForte) {
        return res.status(400).json({
          message: "Senha deve ter letras e números, mínimo 6 caracteres"
        });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      await UserModel.create(nome, email, hashedPassword, cpf);

      return res.status(201).json({ message: "Usuário cadastrado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      const user: any = await UserModel.findByEmail(email);

      if (!user || user.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const validPassword = await bcrypt.compare(senha, user[0].senha);

      if (!validPassword) {
        return res.status(401).json({ message: "Senha inválida" });
      }

      const token = jwt.sign(
        { id: user[0].id },
        "segredo_super_secreto",
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao fazer login" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { usuarios, total } = await UserModel.findAllWithPagination(limit, offset);

      return res.status(200).json({
        usuarios,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      if (Number(id) !== userId) {
        return res.status(403).json({
          message: "Você só pode editar seu próprio usuário"
        });
      }

      const userAtual: any = await UserModel.findById(Number(id));

      if (!userAtual || userAtual.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { nome, senha, cpf } = req.body;

      if (!nome || !senha || !cpf) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios: nome, senha, CPF"
        });
      }

      if (req.body.email && req.body.email !== userAtual[0].email) {
        return res.status(400).json({
          message: "Não é permitido alterar o email"
        });
      }

      if (!validarCPF(cpf)) {
        return res.status(400).json({ message: "CPF inválido" });
      }

      const senhaForte = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(senha);
      if (!senhaForte) {
        return res.status(400).json({
          message: "Senha deve ter letras e números, mínimo 6 caracteres"
        });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      await UserModel.updateWithoutEmail(Number(id), nome, hashedPassword, cpf);

      return res.status(200).json({ message: "Usuário atualizado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      if (Number(id) !== userId) {
        return res.status(403).json({
          message: "Você só pode deletar seu próprio usuário"
        });
      }

      const userAtual: any = await UserModel.findById(Number(id));

      if (!userAtual || userAtual.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      await UserModel.delete(Number(id));

      return res.status(200).json({ message: "Usuário deletado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  }
}