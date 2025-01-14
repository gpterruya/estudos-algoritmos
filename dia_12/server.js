const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const Joi = require("joi");

const app = express();
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "gerenciamentoUsuarios";
const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    idade: Joi.number().integer().min(0).max(120),
});

app.use(express.json());

app.get("/usuarios", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const usuarios = await db.collection("usuarios").find().toArray();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).send("Erro ao buscar usuários");
    }
});

app.post("/usuarios", async (req, res) => {
    const { error, value } = usuarioSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ erro: error.details[0].message });
    }

    try {
        await client.connect();
        const db = client.db(dbName);

        // Insere o usuário no banco de dados
        const resultado = await db.collection("usuarios").insertOne(value);
        res.status(201).send("Usuário criado com sucesso!");
    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.status(500).send("Erro no servidor.");
    }
});


app.delete("/usuarios/:id", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);

        // Obtém o ID do usuário da URL
        const id = req.params.id;

        // Remove o usuário com o ID especificado
        const resultado = await db.collection("usuarios").deleteOne({ _id: new ObjectId(id) });

        if (resultado.deletedCount === 1) {
            res.status(200).send("Usuário deletado com sucesso!");
        } else {
            res.status(404).send("Usuário não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).send("Erro no servidor.");
    }
});

app.put("/usuarios/:id", async (req, res) => {
    const { error, value } = usuarioSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ erro: error.details[0].message });
    }
    
    try {
        await client.connect();
        const db = client.db(dbName);

        // Obtém o ID do usuário da URL
        const id = req.params.id;

        // Obtém os dados para atualização
        const dadosAtualizados = req.body;

        // Atualiza o usuário com o ID especificado
        const resultado = await db.collection("usuarios").updateOne(
            { _id: new MongoClient.ObjectId(id) }, // Filtro pelo ID
            { $set: dadosAtualizados }            // Dados a serem atualizados
        );

        if (resultado.matchedCount === 0) {
            res.status(404).send("Usuário não encontrado.");
        } else {
            res.status(200).send("Usuário atualizado com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).send("Erro no servidor.");
    }
});


app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
