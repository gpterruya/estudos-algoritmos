const apiUrl = "http://localhost:3000/tarefas"; // Atualize com a URL da sua API

// Referências aos elementos do DOM
const novaTarefaInput = document.getElementById("novaTarefa");
const addTarefaBtn = document.getElementById("addTarefa");
const listaTarefas = document.getElementById("listaTarefas");

// Função para carregar as tarefas
async function carregarTarefas() {
    try {
        const response = await fetch(apiUrl);
        const tarefas = await response.json();
        listaTarefas.innerHTML = "";
        tarefas.forEach((tarefa) => {
            const li = document.createElement("li");
            li.textContent = tarefa.tarefa;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Excluir";
            deleteBtn.onclick = () => excluirTarefa(tarefa.id);
            li.appendChild(deleteBtn);
            listaTarefas.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
    }
}

// Função para adicionar uma nova tarefa
async function adicionarTarefa() {
    const tarefa = novaTarefaInput.value.trim();
    if (!tarefa) {
        alert("Digite uma tarefa!");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tarefa }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || "Erro ao adicionar tarefa!");
        } else {
            novaTarefaInput.value = "";
            carregarTarefas();
        }
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
    }
}

// Função para excluir uma tarefa
async function excluirTarefa(id) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });
        carregarTarefas();
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
    }
}

// Configurações de eventos
addTarefaBtn.addEventListener("click", adicionarTarefa);
document.addEventListener("DOMContentLoaded", carregarTarefas);