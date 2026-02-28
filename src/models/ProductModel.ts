import { connection } from "../database";

export class ProductModel {

  static async create(nome: string, descricao: string, preco: number) {
    const sql = `
      INSERT INTO produtos (nome, descricao, preco)
      VALUES (?, ?, ?)
    `;

    await connection.execute(sql, [nome, descricao, preco]);
  }

  static async findAll() {
    const sql = `SELECT * FROM produtos`;
    const [rows] = await connection.execute(sql);
    return rows;
  }

}