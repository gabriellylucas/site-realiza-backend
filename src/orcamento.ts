import { Router } from "express";

const router = Router();

// 🔥 banco fake (por enquanto)
let orcamentos: any[] = [];

// ✅ CRIAR orçamento (CREATE)
router.post("/", (req, res) => {
  const { empresa, cnpj, local, equipamentos } = req.body;

  // 🔐 Validação básica
  if (!empresa || !cnpj || !equipamentos || equipamentos.length === 0) {
    return res.status(400).json({
      erro: "Campos obrigatórios faltando ou equipamentos vazio"
    });
  }

  let totalKg = 0;

  // 🧠 cálculo automático baseado no modelo real
  equipamentos.forEach((item: any) => {
    const { tipo, litragem, quantidade } = item;

    if (!tipo || !quantidade) return;

    if (tipo === "KIT") {
      // cada kit = 80kg
      totalKg += quantidade * 80;
    } else {
      if (!litragem) return;

      // 0,50 g/L → convertido para kg
      totalKg += (litragem * 0.5 * quantidade) / 1000;
    }
  });

  // 💰 valor baseado no modelo
  const investimentoTotal = totalKg * 3960;

  const novoOrcamento = {
    id: Date.now().toString(),
    empresa,
    cnpj,
    local,
    equipamentos,

    quantidadeTotalKg: Number(totalKg.toFixed(2)),
    investimentoTotal: Number(investimentoTotal.toFixed(2)),

    dataProposta: new Date(),
    status: "EM_ANALISE"
  };

  orcamentos.push(novoOrcamento);

  res.status(201).json(novoOrcamento);
});

// ✅ LISTAR todos os orçamentos (READ)
router.get("/", (req, res) => {
  res.json(orcamentos);
});

// ✅ BUSCAR por ID
router.get("/:id", (req, res) => {
  const orcamento = orcamentos.find(o => o.id === req.params.id);

  if (!orcamento) {
    return res.status(404).json({ erro: "Orçamento não encontrado" });
  }

  res.json(orcamento);
});

// ✅ ATUALIZAR status (ex: admin)
router.put("/:id/status", (req, res) => {
  const { status } = req.body;

  const orcamento = orcamentos.find(o => o.id === req.params.id);

  if (!orcamento) {
    return res.status(404).json({ erro: "Orçamento não encontrado" });
  }

  orcamento.status = status;

  res.json(orcamento);
});

// ✅ DELETAR orçamento
router.delete("/:id", (req, res) => {
  const index = orcamentos.findIndex(o => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ erro: "Orçamento não encontrado" });
  }

  orcamentos.splice(index, 1);

  res.json({ mensagem: "Orçamento removido com sucesso" });
});

export default router;