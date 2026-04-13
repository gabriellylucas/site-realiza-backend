import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, "segredo_super_secreto");

    (req as any).userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}