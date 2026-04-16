import { Request, Response } from "express";
import { ContatoModel } from "../models/ContatoModel";

export class ContatoController {

  static async create(req: Request, res: Response) {
    try {
      const { nome, email, mensagem } = req.body;

      if (!nome || !email || !mensagem) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      await ContatoModel.create(nome, email, mensagem);

      return res.status(201).json({ message: "Mensagem enviada com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao enviar mensagem" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const offset = (page - 1) * limit;

      const { contatos, total } = await ContatoModel.findAllWithPagination(limit, offset);

      return res.status(200).json({
        contatos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar mensagens" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, mensagem } = req.body;

      if (!nome || !email || !mensagem) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      await ContatoModel.update(Number(id), nome, email, mensagem);

      return res.status(200).json({ message: "Mensagem atualizada com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar mensagem" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await ContatoModel.delete(Number(id));

      return res.status(200).json({ message: "Mensagem deletada com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar mensagem" });
    }
  }

  static async getById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const contato = await ContatoModel.findById(Number(id));

    if (!contato) {
      return res.status(404).json({ message: "Contato não encontrado" });
    }

    return res.status(200).json(contato);

  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar contato" });
  }
}

}