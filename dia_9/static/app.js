const apiUrl = "http://127.0.0.1:5000/tarefas";

// Fetch e exibição das tarefas
function carregarTarefas() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tarefasList = document.getElementById("tarefas");
            tarefasList.innerHTML = ""; // Limpa a lista
            data.tarefas.forEach(tarefa => {
                const li = document.createElement("li");
                li.textContent = `${tarefa.titulo}: ${tarefa.descricao}`;
                tarefasList.appendChild(li);
            });
        })
        .catch(error => console.error("Erro ao carregar tarefas:", error));
}

// Adicionar nova tarefa
document.getElementById("nova-tarefa").addEventListener("submit", function (e) {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao }),
    })
        .then(response => {
            if (response.ok) {
                carregarTarefas();
                document.getElementById("nova-tarefa").reset(); // Limpa o formulário
            } else {
                console.error("Erro ao adicionar tarefa");
            }
        })
        .catch(error => console.error("Erro:", error));
});

// Carregar tarefas ao iniciar
carregarTarefas();