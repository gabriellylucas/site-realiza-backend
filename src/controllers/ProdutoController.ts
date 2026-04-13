import { Request, Response } from "express";
import { ProdutoModel } from "../models/ProdutoModel";

export class ProdutoController {

  static async create(req: Request, res: Response) {
    try {
      const { nome, descricao, preco } = req.body;

      if (!nome || !descricao || !preco) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      if (preco <= 0) {
        return res.status(400).json({ message: "Preço deve ser maior que zero" });
      }

      await ProdutoModel.create(nome, descricao, preco);

      return res.status(201).json({ message: "Produto criado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar produto" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { produtos, total } = await ProdutoModel.findAllWithPagination(limit, offset);

      return res.status(200).json({
        produtos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco } = req.body;

      if (!nome || !descricao || !preco) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      if (preco <= 0) {
        return res.status(400).json({ message: "Preço deve ser maior que zero" });
      }

      const produtoExiste = await ProdutoModel.findById(Number(id));

      if (!produtoExiste) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      await ProdutoModel.update(Number(id), nome, descricao, preco);

      return res.status(200).json({ message: "Produto atualizado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar produto" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const produtoExiste = await ProdutoModel.findById(Number(id));

      if (!produtoExiste) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      await ProdutoModel.delete(Number(id));

      return res.status(200).json({ message: "Produto deletado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar produto" });
    }
  }
}