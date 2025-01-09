from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3

def inicializar_banco():
    conexao = sqlite3.connect("tarefas.db")
    cursor = conexao.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL,
            status TEXT NOT NULL
        )
    ''')
    conexao.commit()
    conexao.close()

inicializar_banco()

app = Flask(__name__)

# Lista de tarefas
tarefas = []
proximo_id = 1  # Gerador de IDs incrementais

@app.route("/")
def index():
    return render_template("index.html", tarefas=tarefas)

@app.route("/adicionar", methods=["POST"])
def adicionar():
    descricao = request.form.get("descricao")
    status = request.form.get("status", "pendente")
    global proximo_id
    if descricao:
        tarefas.append({"id": proximo_id, "descricao": descricao, "status": status})
        proximo_id += 1
    return redirect(url_for("index"))

@app.route("/remover/<int:tarefa_id>")
def remover(tarefa_id):
    global tarefas
    tarefas = [tarefa for tarefa in tarefas if tarefa["id"] != tarefa_id]
    return redirect(url_for("index"))

@app.route("/alterar_status/<int:tarefa_id>")
def alterar_status(tarefa_id):
    for tarefa in tarefas:
        if tarefa["id"] == tarefa_id:
            tarefa["status"] = "concluída" if tarefa["status"] == "pendente" else "pendente"
            break
    return redirect(url_for("index"))

# Rotas da API
@app.route("/api/tarefas", methods=["GET"])
def api_listar_tarefas():
    return jsonify(tarefas)

@app.route("/api/tarefas", methods=["POST"])
def api_adicionar_tarefa():
    data = request.get_json()
    descricao = data.get("descricao")
    status = data.get("status", "pendente")
    global proximo_id
    if descricao:
        nova_tarefa = {"id": proximo_id, "descricao": descricao, "status": status}
        tarefas.append(nova_tarefa)
        proximo_id += 1
        return jsonify(nova_tarefa), 201
    return jsonify({"error": "Descrição da tarefa é obrigatória"}), 400

@app.route("/api/tarefas/<int:tarefa_id>", methods=["DELETE"])
def api_remover_tarefa(tarefa_id):
    global tarefas
    tarefa_encontrada = next((tarefa for tarefa in tarefas if tarefa["id"] == tarefa_id), None)
    if tarefa_encontrada:
        tarefas = [tarefa for tarefa in tarefas if tarefa["id"] != tarefa_id]
        return jsonify({"message": "Tarefa removida com sucesso"}), 200
    return jsonify({"error": "Tarefa não encontrada"}), 404

@app.route("/api/tarefas/<int:tarefa_id>", methods=["PATCH"])
def api_alterar_status_tarefa(tarefa_id):
    for tarefa in tarefas:
        if tarefa["id"] == tarefa_id:
            tarefa["status"] = "concluída" if tarefa["status"] == "pendente" else "pendente"
            return jsonify(tarefa), 200
    return jsonify({"error": "Tarefa não encontrada"}), 404

if __name__ == "__main__":
    app.run(debug=True)