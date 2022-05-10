import { PrismaClient } from "@prisma/client"

/**
 * conexao com o banco de dados
 */
const prismaClient = new PrismaClient();

export default prismaClient;