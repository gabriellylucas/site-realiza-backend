import { connection } from "../services/database";

export class ContatoModel {
  static async create(nome: string, email: string, mensagem: string) {
    const query = `
      INSERT INTO contatos (nome, email, mensagem)
      VALUES (?, ?, ?)
    `;

    const [result] = await connection.execute(query, [nome, email, mensagem]);
    return result;
  }

  static async findAll() {
    const query = `
      SELECT * FROM contatos
      ORDER BY created_at DESC
    `;

    const [rows] = await connection.execute(query);
    return rows;
  }

  static async findById(id: number) {
    const query = `SELECT * FROM contatos WHERE id = ?`;
    const [rows]: any = await connection.execute(query, [id]);
    return rows[0];
  }

  static async update(id: number, nome: string, email: string, mensagem: string) {
    const query = `
      UPDATE contatos
      SET nome = ?, email = ?, mensagem = ?
      WHERE id = ?
    `;

    await connection.execute(query, [nome, email, mensagem, id]);
  }

  static async delete(id: number) {
    const query = `DELETE FROM contatos WHERE id = ?`;
    await connection.execute(query, [id]);
  }
}