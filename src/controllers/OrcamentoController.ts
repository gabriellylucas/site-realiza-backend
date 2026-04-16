import { Request, Response } from "express";
import { OrcamentoModel } from "../models/OrcamentoModel";

export class OrcamentoController {

  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { solicitante, empresa, cnpj, local, equipamentos } = req.body;

      if (!empresa || !cnpj || !equipamentos || equipamentos.length === 0) {
        return res.status(400).json({ message: "Empresa, CNPJ e equipamentos são obrigatórios" });
      }

      let totalKg = 0;

      equipamentos.forEach((item: any) => {
        const { tipo, litragem, quantidade } = item;

        if (!tipo || !quantidade) return;

        if (tipo === "KIT") {
          totalKg += quantidade * 80;
        } else {
          if (!litragem) return;
          totalKg += (litragem * 0.5 * quantidade) / 1000;
        }
      });

      const investimentoTotal = totalKg * 3960;

      const orcamentoData = {
        userId,

        nome: solicitante.nome,
        email: solicitante.email,
        cpf: solicitante.cpf,
        telefone: solicitante.telefone,

        empresa,
        cnpj,
        local: local || null,

        equipamentos: JSON.stringify(equipamentos),

        quantidadeTotalKg: Number(totalKg.toFixed(2)),
        investimentoTotal: Number(investimentoTotal.toFixed(2)),

        status: "EM_ANALISE"
      };

      await OrcamentoModel.create(orcamentoData);

      return res.status(201).json({ message: "Orçamento criado com sucesso" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar orçamento" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { orcamentos, total } = await OrcamentoModel.findAllWithPagination(userId, limit, offset);

      return res.status(200).json({
        orcamentos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar orçamentos" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const orcamento = await OrcamentoModel.findById(Number(id));

      if (!orcamento) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
      }

      if (orcamento.user_id !== userId) {
        return res.status(403).json({ message: "Você só pode visualizar seus próprios orçamentos" });
      }

      return res.status(200).json(orcamento);

    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar orçamento" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const { empresa, cnpj, local } = req.body;

      if (!empresa || !cnpj) {
        return res.status(400).json({ message: "Empresa e CNPJ são obrigatórios" });
      }

      const orcamentoExiste = await OrcamentoModel.findById(Number(id));

      if (!orcamentoExiste) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
      }

      if (orcamentoExiste.user_id !== userId) {
        return res.status(403).json({ message: "Você só pode editar seus próprios orçamentos" });
     }

      await OrcamentoModel.update(Number(id), empresa, cnpj, local || null);

      return res.status(200).json({ message: "Orçamento atualizado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar orçamento" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const orcamentoExiste = await OrcamentoModel.findById(Number(id));

      if (!orcamentoExiste) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
      }

      if (orcamentoExiste.user_id !== userId) {
        return res.status(403).json({ message: "Você só pode deletar seus próprios orçamentos" });
     }

      await OrcamentoModel.delete(Number(id));

      return res.status(200).json({ message: "Orçamento deletado com sucesso" });

    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar orçamento" });
    }
  }
}