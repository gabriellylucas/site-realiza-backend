import { connection } from "../database";

export class UserModel {

  static async create(nome: string, email: string, senha: string, cpf: string) {
    const query = `
      INSERT INTO users (nome, email, senha, cpf)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [nome, email, senha, cpf]);

    return result;
  }

  static async findByEmail(email: string) {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await connection.execute(query, [email]);
    return rows;
  }

}