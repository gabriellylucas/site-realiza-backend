import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

export class UserController {

  static async register(req: Request, res: Response) {
    try {
      const { nome, email, senha, cpf } = req.body;

      if (!nome || !email || !senha || !cpf) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
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

}