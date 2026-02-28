import { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";

export class ProductController {

  static async create(req: Request, res: Response) {
    try {
      const { nome, descricao, preco } = req.body;

      if (!nome || !descricao || !preco) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      await ProductModel.create(nome, descricao, preco);

      return res.status(201).json({ message: "Produto criado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar produto" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const produtos = await ProductModel.findAll();
      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar produtos" });
    }
  }

}