const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(express.json()); // Para entender o JSON que vem do Front
app.use(cors());         // Para liberar o acesso do Front (porta 5173)

// Rota de Saúde (Health Check)
app.get('/', (req, res) => {
  res.send('API FinanceFlow está rodando! 🚀');
});

// ==========================================
// ROTAS DE TRANSAÇÕES (CRUD)
// ==========================================

// 1. LISTAR (GET)
app.get('/transactions', async (req, res) => {
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