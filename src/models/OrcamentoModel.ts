import { connection } from "../services/database";

export class OrcamentoModel {
  static async create(data: any) {
    const query = `
     INSERT INTO orcamentos 
     (user_id, nome, email, cpf, telefone, empresa, cnpj, local, equipamentos, quantidade_total_kg, investimento_total, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     `;

    const [result] = await connection.execute(query, [
      data.userId,
      data.nome,
      data.email,
      data.cpf,
      data.telefone,
      data.empresa,
      data.cnpj,
      data.local,
      data.equipamentos,
      data.quantidadeTotalKg,
      data.investimentoTotal,
      data.status
    ]);

    return result;
  }

  static async findAllWithPagination(userId: number, limit: number, offset: number) {
    const countSql = `SELECT COUNT(*) as total FROM orcamentos WHERE user_id = ?`;
    const [countRows]: any = await connection.execute(countSql, [userId]);
    const total = countRows[0].total;

    const sql = `
      SELECT id, empresa, cnpj, local, equipamentos, quantidade_total_kg, investimento_total, status, created_at 
      FROM orcamentos 
      WHERE user_id = ?
      LIMIT ? OFFSET ?
    `;
    const [rows] = await connection.execute(sql, [userId, limit, offset]);

    return {
      orcamentos: rows,
      total
    };
  }

  static async findById(id: number) {
    const sql = `SELECT * FROM orcamentos WHERE id = ?`;
    const [rows]: any = await connection.execute(sql, [id]);
    return rows[0];
  }

  static async existePorUserId(userId: number) {
    const query = `SELECT id FROM orcamentos WHERE user_id = ? LIMIT 1`;
    const [rows]: any = await connection.execute(query, [userId]);

    return rows.length > 0;
  }

  static async update(id: number, empresa: string, cnpj: string, local: string | null) {
    const query = `
      UPDATE orcamentos
      SET empresa = ?, cnpj = ?, local = ?
      WHERE id = ?
    `;

    await connection.execute(query, [empresa, cnpj, local, id]);
  }

  static async delete(id: number) {
    const query = `DELETE FROM orcamentos WHERE id = ?`;
    await connection.execute(query, [id]);
  }
}