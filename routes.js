import { Router } from "express";
import { pool } from "./db.js";

const routes = Router()

routes.get("/clientes", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM clientes ORDER BY id ASC"
        );

        return res.json(result.rows);
    } catch (erro) {
        console.error("Erro ao buscar clientes:", erro.message);

        return res.status(500).json({
            erro: "Erro interno no servidor."
        });
    }
});

routes.get("/clientes/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query(
            "SELECT * FROM clientes WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                erro: "Cliente não encontrado."
            });
        }

        return res.json(result.rows[0]);
    } catch (erro) {
        console.error("Erro ao buscar cliente:", erro.message);

        return res.status(500).json({
            erro: "Erro interno no servidor."
        });
    }
});

routes.post("/clientes", async (req, res) => {
    const { nome, email, idade } = req.body;

    if (!nome || !email) {
        return res.status(400).json({
            erro: "Nome e email são obrigatórios."
        });
    }

    try {
        const queryText = `
      INSERT INTO clientes (nome, email, idade)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

        const values = [nome, email, idade ?? null];
        const result = await pool.query(queryText, values);

        return res.status(201).json(result.rows[0]);
    } catch (erro) {
        console.error("Erro ao cadastrar cliente:", erro.message);

        return res.status(500).json({
            erro: "Erro ao cadastrar cliente."
        });
    }
});

routes.put("/clientes/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, email, idade } = req.body;

    if (!nome || !email) {
        return res.status(400).json({
            erro: "Nome e email são obrigatórios para PUT."
        });
    }

    try {
        const queryText = `
      UPDATE clientes
      SET nome = $1, email = $2, idade = $3
      WHERE id = $4
      RETURNING *
    `;

        const values = [nome, email, idade ?? null, id];
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                erro: "Cliente não encontrado."
            });
        }

        return res.json(result.rows[0]);
    } catch (erro) {
        console.error("Erro no PUT do cliente:", erro.message);

        return res.status(500).json({
            erro: "Erro ao atualizar cliente."
        });
    }
});

routes.patch("/clientes/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, email, idade } = req.body;

    try {
        const clienteAtual = await pool.query(
            "SELECT * FROM clientes WHERE id = $1",
            [id]
        );

        if (clienteAtual.rows.length === 0) {
            return res.status(404).json({
                erro: "Cliente não encontrado."
            });
        }

        const cliente = clienteAtual.rows[0];

        const novoNome = nome !== undefined ? nome : cliente.nome;
        const novoEmail = email !== undefined ? email : cliente.email;
        const novaIdade = idade !== undefined ? idade : cliente.idade;

        const queryText = `
      UPDATE clientes
      SET nome = $1, email = $2, idade = $3
      WHERE id = $4
      RETURNING *
    `;

        const values = [novoNome, novoEmail, novaIdade, id];
        const result = await pool.query(queryText, values);

        return res.json(result.rows[0]);
    } catch (erro) {
        console.error("Erro no PATCH do cliente:", erro.message);

        return res.status(500).json({
            erro: "Erro ao atualizar cliente."
        });
    }
});

routes.delete("/clientes/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM clientes WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                erro: "Cliente não encontrado."
            });
        }

        return res.status(204).send();
    } catch (erro) {
        console.error("Erro ao remover cliente:", erro.message);

        return res.status(500).json({
            erro: "Erro ao remover cliente."
        });
    }
});

export default routes