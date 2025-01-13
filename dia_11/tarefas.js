const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

// Configurar CORS
app.use(cors({
    origin: "http://127.0.0.1:5500" // Endereço do Front-End
}));
app.use(express.json());

// Funções auxiliares
const carregarTarefas = () => JSON.parse(fs.readFileSync("tarefas.json", "utf-8"));
const salvarTarefas = (tarefas) => fs.writeFileSync("tarefas.json", JSON.stringify(tarefas, null, 2));

// Listar tarefas
app.get("/tarefas", (req, res) => {
    const tarefas = carregarTarefas();
    res.json(tarefas);
});

// Adicionar nova tarefa
app.post("/tarefas", (req, res) => {
    const novaTarefa = req.body;
    const tarefas = carregarTarefas();

    // Verifica duplicação
    const tarefaExistente = tarefas.find(tarefa => tarefa.tarefa.toLowerCase() === novaTarefa.tarefa.toLowerCase());
    if (tarefaExistente) {
        return res.status(400).json({ error: "Essa tarefa já existe!" });
    }

    novaTarefa.id = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1;
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);

    res.status(201).json({ message: "Tarefa adicionada com sucesso!" });
});

// Deletar tarefa
app.delete("/tarefas/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    let tarefas = carregarTarefas();

    const indice = tarefas.findIndex(tarefa => tarefa.id === id);
    if (indice === -1) {
        return res.status(404).json({ error: "Tarefa não encontrada!" });
    }

    tarefas.splice(indice, 1);
    salvarTarefas(tarefas);
    res.json({ message: "Tarefa deletada com sucesso!" });
});

// Atualizar tarefa
app.put("/tarefas/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const novaTarefa = req.body;
    let tarefas = carregarTarefas();

    const indice = tarefas.findIndex(tarefa => tarefa.id === id);
    if (indice === -1) {
        return res.status(404).json({ error: "Tarefa não encontrada!" });
    }

    tarefas[indice] = { ...tarefas[indice], ...novaTarefa };
    salvarTarefas(tarefas);

    res.json({ message: "Tarefa atualizada com sucesso!" });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
