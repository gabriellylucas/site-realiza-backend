import { connection } from "../database";

export class ProdutoModel {

  static async create(nome: string, descricao: string, preco: number) {
    const sql = `
      INSERT INTO produtos (nome, descricao, preco)
      VALUES (?, ?, ?)
    `;

    await connection.execute(sql, [nome, descricao, preco]);
  }

  static async update(id: number, nome: string, descricao: string, preco: number) {
  const sql = `
    UPDATE produtos
    SET nome = ?, descricao = ?, preco = ?
    WHERE id = ?
  `;

  await connection.execute(sql, [nome, descricao, preco, id]);
}

static async delete(id: number) {
  const sql = `DELETE FROM produtos WHERE id = ?`;
  
  await connection.execute(sql, [id]);
}

  static async findAll() {
    const sql = `SELECT * FROM produtos`;
    const [rows] = await connection.execute(sql);
    return rows;
  }

}