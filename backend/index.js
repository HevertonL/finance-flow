const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(express.json()); // Para entender o JSON que vem do Front
app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs)); 

// Rota de Saúde (Health Check)
app.get('/', (req, res) => {
  res.send('API FinanceFlow está rodando! 🚀');
});

// ==========================================
// ROTAS DE TRANSAÇÕES (CRUD)
// ==========================================

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Retorna a lista de todas as transações
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID único da transação (UUID)
 *                   details:
 *                     type: string
 *                     description: Descrição da transação
 *                   amount:
 *                     type: number
 *                     description: Valor monetário
 *                   transactionType:
 *                     type: string
 *                     enum: [ENTRADA, SAIDA]
 *                     description: Tipo da transação
 *                   category:
 *                     type: string
 *                     description: "Categoria (Ex: Alimentacao, Salario)"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Data da transação
 *                   status:
 *                     type: string
 *                     description: "Status (Ex: PENDENTE, PAGO)"
 */

// 1. LISTAR (GET)
app.get('/transactions', async (req, res) => {
   // ... (seu código continua igual aqui)
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc', // Ordena pelas mais recentes
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Erro ao listar:", error);
    res.status(500).json({ error: "Erro interno ao buscar transações" });
  }
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - transactionType
 *               - category
 *               - date
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               transactionType:
 *                 type: string
 *                 enum: [ENTRADA, SAIDA]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *       400:
 *         description: Campos obrigatórios faltando
 */

// 2. CRIAR (POST)
app.post('/transactions', async (req, res) => {
  try {
    const { description, amount, type, category, date, status } = req.body;

    // Validação básica
    if (!description || !amount || !date) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount), // Garante que é número
        type,
        category,
        date: new Date(date), // IMPORTANTE: Converte string "2025-01-23" para Data do banco
        status: status || 'Pendente'
      }
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Erro ao criar:", error);
    res.status(500).json({ error: "Erro ao criar transação" });
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Atualiza uma transação existente
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               transactionType:
 *                 type: string
 *                 enum: [ENTRADA, SAIDA]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transação atualizada
 *       404:
 *         description: Transação não encontrada
 */

// 3. ATUALIZAR (PUT)
app.put('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, category, date, status } = req.body;

    const updatedTransaction = await prisma.transaction.update({
      where: { id: id },
      data: {
        description,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
        status
      }
    });

    res.json(updatedTransaction);
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    // Erro comum: ID não existe (código P2025 do Prisma)
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Transação não encontrada" });
    }
    res.status(500).json({ error: "Erro ao atualizar transação" });
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Remove uma transação
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação deletada com sucesso
 *       404:
 *         description: Transação não encontrada
 */

// 4. DELETAR (DELETE)
app.delete('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({
      where: { id: id }
    });

    res.json({ success: true, message: "Transação deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Transação não encontrada para deletar" });
    }
    res.status(500).json({ error: "Erro ao deletar transação" });
  }
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Rotas disponíveis em http://localhost:${PORT}/transactions`);
});