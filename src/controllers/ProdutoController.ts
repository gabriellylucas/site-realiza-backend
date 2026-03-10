import { Request, Response } from "express";
import { ProdutoModel } from "../models/ProdutoModel";

export class ProdutoController {

  static async create(req: Request, res: Response) {
    try {
      const { nome, descricao, preco } = req.body;

      if (!nome || !descricao || !preco) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      await ProdutoModel.create(nome, descricao, preco);

      return res.status(201).json({ message: "Produto criado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar produto" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const produtos = await ProdutoModel.findAll();
      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  }

  static async update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, descricao, preco } = req.body;

    await ProdutoModel.update(Number(id), nome, descricao, preco);

    return res.status(200).json({ message: "Produto atualizado com sucesso" });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar produto" });
  }
}

static async delete(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await ProdutoModel.delete(Number(id));

    return res.status(200).json({ message: "Produto deletado com sucesso" });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar produto" });
  }
}

}